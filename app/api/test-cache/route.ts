import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';
import { redis } from '@/lib/cache/redisClient';

export async function GET() {
  const results: any = {};

  try {
    await redis.set('test-key', 'Hello Upstash!', 'EX', 60);
    const testValue = await redis.get('test-key');
    results.redis = { status: 'connected', test: testValue };
  } catch (error: any) {
    results.redis = { status: 'error', error: error.message };
  }

  try {
    const bookmakers = await apiClient.getCached('odds/bookmakers', {}, { ttl: 3600 });
    results.bookmakers = {
      status: 'success',
      count: bookmakers.response?.length || 0,
      sample: bookmakers.response?.slice(0, 3)
    };
  } catch (error: any) {
    results.bookmakers = { status: 'error', error: error.message };
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const matches = await apiClient.getCached('fixtures', { date: today }, { ttl: 3600 });
    results.matches = {
      status: 'success',
      count: matches.results || 0
    };
  } catch (error: any) {
    results.matches = { status: 'error', error: error.message };
  }

  return NextResponse.json(results);
}