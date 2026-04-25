import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const predictions = await redis.get('predictions');
    const lastUpdate = await redis.get('predictions_last_update');
    const fixtureCount = await redis.get('predictions_fixture_count');
    
    let status = 'no_cache';
    let cacheAgeMinutes = null;
    
    if (predictions && lastUpdate) {
      const predictionsData = JSON.parse(predictions);
      const lastUpdateDate = new Date(lastUpdate);
      const now = new Date();
      cacheAgeMinutes = Math.floor((now.getTime() - lastUpdateDate.getTime()) / 1000 / 60);
      status = cacheAgeMinutes < 60 ? 'fresh' : 'stale';
      
      return NextResponse.json({
        status: status,
        cachedPredictions: predictionsData.length || 0,
        lastUpdate: lastUpdate,
        lastUpdateDate: lastUpdateDate.toLocaleString(),
        cacheAgeMinutes: cacheAgeMinutes,
        fixtureCount: parseInt(fixtureCount) || 0,
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
    return NextResponse.json(
      { error: 'Failed to get status', details: error.message },
      { status: 500 }
    );
  }
}