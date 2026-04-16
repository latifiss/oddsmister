import { NextResponse } from 'next/server';
import { redis } from '@/lib/cache/redisClient';
import { apiClient } from '@/lib/api/apiFootballClient';

export async function GET() {
  const results: any = {};

  try {
    await redis.set('test-key', 'Upstash is working!');
    const testValue = await redis.get('test-key');
    results.redis = { status: 'connected', test: testValue };
  } catch (error: any) {
    results.redis = { status: 'error', error: error.message };
  }

  try {
    const bookmakers = await apiClient.getCached('odds/bookmakers', {}, { ttl: 3600 });
    results.bookmakers = {
      status: 'success',
      count: bookmakers.response?.length || 0
    };
  } catch (error: any) {
    results.bookmakers = { status: 'error', error: error.message };
  }

  return NextResponse.json(results);
}