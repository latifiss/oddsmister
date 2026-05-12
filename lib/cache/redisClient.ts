import { Redis } from '@upstash/redis';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  console.warn('Upstash Redis credentials not defined, using memory cache fallback');
}

export const redis = new Redis({
  url: UPSTASH_URL!,
  token: UPSTASH_TOKEN!,
});

redis.ping().then(() => {}).catch((error) => {});