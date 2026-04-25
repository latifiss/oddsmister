// lib/redis.ts
import { Redis } from '@upstash/redis';

// Using Upstash Redis (your current setup)
const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    console.warn('⚠️ Redis credentials missing, using mock Redis for build');
    // Return a mock Redis client during build
    return {
      get: async () => null,
      set: async () => null,
      incr: async () => 0,
      expire: async () => null,
    } as unknown as Redis;
  }
  
  return new Redis({
    url,
    token,
  });
};

export const redis = getRedisClient();

// Helper function for rate limiting
export async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    return current <= limit;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow on error
  }
}