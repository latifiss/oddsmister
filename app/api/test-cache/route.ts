import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';
import { redis } from '@/lib/cache/redisClient';

interface RedisResult {
  status: string;
  test?: string | null;
  error?: string;
}

interface BookmakersResult {
  status: string;
  count?: number;
  sample?: Record<string, unknown>[];
  error?: string;
}

interface MatchesResult {
  status: string;
  count?: number;
  error?: string;
}

interface TestResults {
  redis: RedisResult;
  bookmakers: BookmakersResult;
  matches: MatchesResult;
}

export async function GET() {
  const results: TestResults = {
    redis: { status: 'pending' },
    bookmakers: { status: 'pending' },
    matches: { status: 'pending' }
  };

  try {
    await redis.set('test-key', 'Hello Upstash!', { ex: 60 });
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
      count: bookmakers.response?.length || 0,
      sample: bookmakers.response?.slice(0, 3)
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.bookmakers = { 
      status: 'error', 
      error: errorMessage 
    };
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const matches = await apiClient.getCached('fixtures', { date: today }, { ttl: 3600 });
    results.matches = {
      status: 'success',
      count: matches.results || 0
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.matches = { 
      status: 'error', 
      error: errorMessage 
    };
  }

  return NextResponse.json(results);
}