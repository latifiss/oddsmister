// app/api/predictions/route.ts (Replace with this)
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/cache/redisClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fixtureId = searchParams.get('fixtureId');

  if (!fixtureId) {
    return NextResponse.json({ error: 'Fixture ID required' }, { status: 400 });
  }

  try {
    // Try to get prediction from Upstash Redis cache first
    const cacheKey = `prediction:${fixtureId}`;
    const cachedPrediction = await redis.get(cacheKey);
    
    if (cachedPrediction) {
      // Return cached prediction immediately (super fast!)
      console.log(`📦 Cache HIT: prediction ${fixtureId} served from Upstash`);
      return NextResponse.json({
        response: [JSON.parse(cachedPrediction as string)],
        cached: true,
        fromCache: 'upstash'
      });
    }
    
    // If not in cache, fetch from API (fallback - should rarely happen)
    console.log(`🔄 Cache MISS: prediction ${fixtureId}, fetching from API`);
    const { apiClient } = await import('@/lib/api/apiFootballClient');
    const data = await apiClient.getCached('predictions', { fixture: fixtureId }, { ttl: 43200 });
    
    // Cache the result for future requests
    if (data.response && data.response[0]) {
      await redis.setex(
        cacheKey,
        24 * 60 * 60, // 24 hours
        JSON.stringify(data.response[0])
      );
      console.log(`💾 Cached prediction ${fixtureId} to Upstash`);
    }
    
    return NextResponse.json({
      ...data,
      cached: false,
      fromCache: 'api'
    });
  } catch (error) {
    console.error('Failed to fetch prediction:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}