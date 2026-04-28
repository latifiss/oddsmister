import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [cachedData, lastUpdate, fixtureCount, totalAvailable, selectedIds, successCount, errorCount] = await Promise.all([
      redis.get('predictions_feed').catch(() => null),
      redis.get('predictions_last_update').catch(() => null),
      redis.get('predictions_fixture_count').catch(() => null),
      redis.get('predictions_total_available').catch(() => null),
      redis.get('predictions_selected_ids').catch(() => null),
      redis.get('predictions_success_count').catch(() => null),
      redis.get('predictions_error_count').catch(() => null),
    ]);
    
    if (!cachedData || !lastUpdate) {
      return NextResponse.json({
        status: 'no_cache',
        cachedPredictions: 0,
        lastUpdate: null,
        lastUpdateDate: null,
        cacheAgeMinutes: null,
        fixtureCount: 0,
        totalFixturesAvailable: 0,
        selectedFixtureIds: [],
        successCount: 0,
        errorCount: 0,
        lastUpdateStats: null
      });
    }
    
    let predictionsArray = [];
    try {
      if (typeof cachedData === 'string') {
        predictionsArray = JSON.parse(cachedData);
      } else if (Array.isArray(cachedData)) {
        predictionsArray = cachedData;
      } else if (cachedData && typeof cachedData === 'object') {
        predictionsArray = [cachedData];
      } else {
        predictionsArray = [];
      }
    } catch (parseError) {
      console.error('Failed to parse cached predictions:', parseError);
      return NextResponse.json({
        status: 'corrupted',
        cachedPredictions: 0,
        lastUpdate: lastUpdate,
        lastUpdateDate: new Date(lastUpdate as string).toLocaleString(),
        error: 'Cache data is corrupted',
        fixtureCount: 0,
        totalFixturesAvailable: 0
      });
    }
    
    const lastUpdateDate = new Date(lastUpdate as string);
    const now = new Date();
    const cacheAgeMinutes = Math.floor((now.getTime() - lastUpdateDate.getTime()) / 1000 / 60);
    const isFresh = cacheAgeMinutes < 1440; // 24 hours
    
    let selectedIdsArray = [];
    if (selectedIds) {
      try {
        selectedIdsArray = typeof selectedIds === 'string' ? JSON.parse(selectedIds) : selectedIds;
      } catch (e) {
        console.error('Failed to parse selected IDs:', e);
      }
    }
    
    return NextResponse.json({
      status: isFresh ? 'fresh' : 'stale',
      cachedPredictions: predictionsArray.length,
      lastUpdate: lastUpdate,
      lastUpdateDate: lastUpdateDate.toLocaleString(),
      cacheAgeMinutes: cacheAgeMinutes,
      fixtureCount: parseInt(fixtureCount as string) || 0,
      totalFixturesAvailable: parseInt(totalAvailable as string) || 0,
      selectedFixtureIds: selectedIdsArray,
      successCount: parseInt(successCount as string) || 0,
      errorCount: parseInt(errorCount as string) || 0,
      lastUpdateStats: {
        age: `${cacheAgeMinutes} minutes ago`,
        freshness: isFresh ? 'good' : 'needs refresh',
        nextUpdateIn: isFresh 
          ? `${Math.max(0, 1440 - cacheAgeMinutes)} minutes` 
          : 'overdue',
        successRate: predictionsArray.length > 0 
          ? `${Math.round((parseInt(successCount as string) || 0) / predictionsArray.length * 100)}%`
          : '0%'
      }
    });
    
  } catch (error) {
    console.error('Status endpoint error:', error);
    
    return NextResponse.json({
      status: 'error',
      cachedPredictions: 0,
      lastUpdate: null,
      lastUpdateDate: null,
      cacheAgeMinutes: null,
      fixtureCount: 0,
      totalFixturesAvailable: 0,
      selectedFixtureIds: [],
      message: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Try running /api/predictions/update to refresh the cache'
    });
  }
}