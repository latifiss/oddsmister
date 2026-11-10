import { redis } from '../cache/redisClient';

interface CacheOptions {
  ttl?: number;
  forceRefresh?: boolean;
}

const API_BASE_URL = 'https://v3.football.api-sports.io';
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_RETRIES = 2;

function stableParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, String(value)])
  );
}

function getRetryDelay(response: Response, attempt: number) {
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.min(seconds * 1_000, 10_000);
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, Math.min(date - Date.now(), 10_000));
  }
  return Math.min(1_000 * 2 ** attempt, 5_000);
}

class APIFootballClient {
  private static instance: APIFootballClient;
  private readonly inFlight = new Map<string, Promise<unknown>>();

  private constructor() {}

  static getInstance() {
    if (!APIFootballClient.instance) {
      APIFootballClient.instance = new APIFootballClient();
    }
    return APIFootballClient.instance;
  }

  async request<T = unknown>(endpoint: string, params: Record<string, unknown> = {}): Promise<T> {
    const apiKey = process.env.API_FOOTBALL_KEY;
    if (!apiKey) throw new Error('API_FOOTBALL_KEY is not configured');

    const query = new URLSearchParams(stableParams(params));
    const url = `${API_BASE_URL}/${endpoint.replace(/^\/+/, '')}${query.size ? `?${query}` : ''}`;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      const response = await fetch(url, {
        headers: { 'x-apisports-key': apiKey },
        cache: 'no-store',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.ok) return (await response.json()) as T;

      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === MAX_RETRIES) {
        const detail = await response.text().catch(() => '');
        throw new Error(
          `API-Football request failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ''}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, getRetryDelay(response, attempt)));
    }

    throw new Error('API-Football request failed after retries');
  }

  async getCached<T = unknown>(
    endpoint: string,
    params: Record<string, unknown> = {},
    options: CacheOptions = {}
  ): Promise<T> {
    const normalizedParams = stableParams(params);
    const cacheKey = `api:v2:${endpoint}:${JSON.stringify(normalizedParams)}`;
    const { ttl = 300, forceRefresh = false } = options;

    if (!forceRefresh) {
      try {
        const cached = await redis.get<T>(cacheKey);
        if (cached !== null && cached !== undefined) {
          if (typeof cached === 'string') {
            try {
              return JSON.parse(cached) as T;
            } catch {
              // Refresh malformed entries from the upstream API.
            }
          } else {
            return cached;
          }
        }
      } catch (error) {
        console.warn('[api-cache] Cache read failed; using upstream API:', error);
      }
    }

    const existing = this.inFlight.get(cacheKey);
    if (existing && !forceRefresh) return (await existing) as T;

    const pending = (async () => {
      const data = await this.request<T>(endpoint, normalizedParams);
      try {
        await redis.setex(cacheKey, ttl, JSON.stringify(data));
      } catch (error) {
        console.warn('[api-cache] Cache write failed:', error);
      }
      return data;
    })();

    this.inFlight.set(cacheKey, pending);
    try {
      return await pending;
    } finally {
      if (this.inFlight.get(cacheKey) === pending) this.inFlight.delete(cacheKey);
    }
  }
}

export const apiClient = APIFootballClient.getInstance();
