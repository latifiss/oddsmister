import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if Redis is available
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'Redis not configured',
        cachedPredictions: 0,
        lastUpdate: null,
        lastUpdateDate: null,
        cacheAgeMinutes: null,
        fixtureCount: 0
      });
    }
    
    const predictions = await redis.get('predictions');
    const lastUpdate = await redis.get('predictions_last_update');
    const fixtureCount = await redis.get('predictions_fixture_count');
    
    let status = 'no_cache';
    let cacheAgeMinutes = null;
    
    if (predictions && lastUpdate) {
      const predictionsData = typeof predictions === 'string' ? JSON.parse(predictions) : predictions;
      const lastUpdateDate = new Date(lastUpdate as string);
      const now = new Date();
      cacheAgeMinutes = Math.floor((now.getTime() - lastUpdateDate.getTime()) / 1000 / 60);
      status = cacheAgeMinutes < 1440 ? 'fresh' : 'stale'; // 24 hours
      
      return NextResponse.json({
        status: status,
        cachedPredictions: Array.isArray(predictionsData) ? predictionsData.length : 0,
        lastUpdate: lastUpdate,
        lastUpdateDate: lastUpdateDate.toLocaleString(),
        cacheAgeMinutes: cacheAgeMinutes,
        fixtureCount: parseInt(fixtureCount as string) || 0,
        lastUpdateStats: {
          age: `${cacheAgeMinutes} minutes ago`,
          freshness: status === 'fresh' ? 'good' : 'needs refresh'
        }
      });
    }
    
    return NextResponse.json({
      status: 'no_cache',
      cachedPredictions: 0,
      lastUpdate: null,
      lastUpdateDate: null,
      cacheAgeMinutes: null,
      fixtureCount: 0,
      lastUpdateStats: null
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to get status', cachedPredictions: 0 },
      { status: 500 }
    );
  }
}