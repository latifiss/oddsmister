import { NextResponse } from 'next/server';
import { redis } from '@/lib/cache/redisClient';
import { apiClient } from '@/lib/api/apiFootballClient';

interface RedisResult {
  status: string;
  test?: string | null;
  error?: string;
}

interface BookmakersResult {
  status: string;
  count?: number;
  error?: string;
}

interface TestResults {
  redis: RedisResult;
  bookmakers: BookmakersResult;
}

export async function GET() {
  const results: TestResults = {
    redis: { status: 'pending' },
    bookmakers: { status: 'pending' }
  };

  try {
    await redis.set('test-key', 'Upstash is working!');
    const testValue = await redis.get('test-key');
    results.redis = { 
      status: 'connected', 
      test: testValue as string | null 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.redis = { 
      status: 'error', 
      error: errorMessage 
    };
  }

  try {
    const bookmakers = await apiClient.getCached('odds/bookmakers', {}, { ttl: 3600 });
    results.bookmakers = {
      status: 'success',
      count: bookmakers.response?.length || 0
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.bookmakers = { 
      status: 'error', 
      error: errorMessage 
    };
  }

  return NextResponse.json(results);
}