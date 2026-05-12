import { Redis } from '@upstash/redis';

const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
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

export async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    return current <= limit;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; 
  }
}