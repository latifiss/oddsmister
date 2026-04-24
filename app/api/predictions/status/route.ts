import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/cache/redisClient';

export async function GET(request: NextRequest) {
  try {
    // Get last update info
    const lastUpdateRaw = await redis.get('predictions:last_update');
    const lastUpdate = lastUpdateRaw ? JSON.parse(lastUpdateRaw as string) : null;
    
    // Get cached fixtures list
    const cachedFixturesRaw = await redis.get('predictions:cached_fixtures');
    const cachedFixtures = cachedFixturesRaw ? JSON.parse(cachedFixturesRaw as string) : [];
    
    // Calculate cache age
    let cacheAge = null;
    if (lastUpdate?.timestamp) {
      const lastUpdateTime = new Date(lastUpdate.timestamp).getTime();
      const now = Date.now();
      cacheAge = Math.floor((now - lastUpdateTime) / 1000 / 60); // minutes
    }
    
    return NextResponse.json({
      status: cachedFixtures.length > 0 ? 'healthy' : 'no_cache',
      cachedPredictions: cachedFixtures.length,
      lastUpdate: lastUpdate?.timestamp || null,
      lastUpdateDate: lastUpdate?.date || null,
      cacheAgeMinutes: cacheAge,
      fixtureCount: lastUpdate?.fixtureCount || 0,
      lastUpdateStats: lastUpdate ? {
        successCount: lastUpdate.successCount,
        failCount: lastUpdate.failCount,
        duration: lastUpdate.duration
      } : null
    });
  } catch (error) {
    console.error('Status check failed:', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}