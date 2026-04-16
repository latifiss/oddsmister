import { redis } from '../cache/redisClient';

interface CacheOptions {
  ttl?: number;
  forceRefresh?: boolean;
}

class APIFootballClient {
  private static instance: APIFootballClient;
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private minuteStartTime: number = Date.now();

  private constructor() {}

  static getInstance() {
    if (!APIFootballClient.instance) {
      APIFootballClient.instance = new APIFootballClient();
    }
    return APIFootballClient.instance;
  }

  private async checkRateLimit() {
    const now = Date.now();
    
    if (now - this.minuteStartTime > 60000) {
      this.requestCount = 0;
      this.minuteStartTime = now;
    }
    
    if (this.requestCount >= 10) {
      const waitTime = 60000 - (now - this.minuteStartTime);
      console.log(`Rate limit waiting ${Math.ceil(waitTime / 1000)} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.minuteStartTime = Date.now();
    }
    
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 6000 && this.lastRequestTime > 0) {
      const waitTime = 6000 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  async request(endpoint: string, params: Record<string, any> = {}) {
    await this.checkRateLimit();

    const queryString = new URLSearchParams(params).toString();
    const url = `https://v3.football.api-sports.io/${endpoint}${queryString ? `?${queryString}` : ''}`;

    console.log(`📡 API Request: ${endpoint}`);
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });

    const data = await response.json();

    if (response.status === 429) {
      console.log('⚠️ Rate limited, waiting 15 seconds...');
      await new Promise(resolve => setTimeout(resolve, 15000));
      return this.request(endpoint, params);
    }

    if (response.status !== 200) {
      console.error(`API Error: ${response.status}`, data);
      throw new Error(`API request failed: ${response.status}`);
    }

    console.log(`✅ API Success: ${endpoint} - ${data.results} results`);
    return data;
  }

  async getCached(endpoint: string, params: Record<string, any> = {}, options: CacheOptions = {}) {
    const cacheKey = `api:${endpoint}:${JSON.stringify(params)}`;
    const { ttl = 300, forceRefresh = false } = options;

    if (!forceRefresh) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log(`💾 Cache HIT: ${endpoint}`);
          return cached;
        }
      } catch (error) {
        console.error('Redis read error:', error);
      }
    }

    console.log(`🔄 Cache MISS: ${endpoint}`);
    const data = await this.request(endpoint, params);
    
    try {
      await redis.setex(cacheKey, ttl, JSON.stringify(data));
      console.log(`💾 Cached: ${endpoint} for ${ttl}s`);
    } catch (error) {
      console.error('Redis write error:', error);
    }
    
    return data;
  }
}

export const apiClient = APIFootballClient.getInstance();