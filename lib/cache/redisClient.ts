import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const client = url && token ? new Redis({ url, token }) : null;

if (!client) {
  console.warn('[redis] Upstash credentials are missing. API caching is disabled.');
}

export const redis = {
  async get<T = unknown>(key: string): Promise<T | null> {
    if (!client) return null;
    return client.get<T>(key);
  },

  async setex(key: string, seconds: number, value: string): Promise<unknown> {
    if (!client) return null;
    return client.set(key, value, { ex: seconds });
  },
};
