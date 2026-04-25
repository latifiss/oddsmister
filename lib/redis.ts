import { Redis } from '@upstash/redis';

// Using Upstash Redis (recommended for Vercel)
const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is not set');
  }
  
  return new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });
};

export const redis = getRedisClient();

// Helper function for rate limiting
export async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return current <= limit;
}