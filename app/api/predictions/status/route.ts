import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cachedData = await redis.get('predictions_feed');
    const lastUpdate = await redis.get('predictions_last_update');
    const fixtureCount = await redis.get('predictions_fixture_count');
    const totalAvailable = await redis.get('predictions_total_available');
    const selectedIds = await redis.get('predictions_selected_ids');
    
    let status = 'no_cache';
    let cacheAgeMinutes = null;
    let predictionsData = [];
    
    if (cachedData && lastUpdate) {
      predictionsData = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      const lastUpdateDate = new Date(lastUpdate as string);
      const now = new Date();
      cacheAgeMinutes = Math.floor((now.getTime() - lastUpdateDate.getTime()) / 1000 / 60);
      status = cacheAgeMinutes < 1440 ? 'fresh' : 'stale';
      
      return NextResponse.json({
        status: status,
        cachedPredictions: predictionsData.length,
        lastUpdate: lastUpdate,
        lastUpdateDate: lastUpdateDate.toLocaleString(),
        cacheAgeMinutes: cacheAgeMinutes,
        fixtureCount: parseInt(fixtureCount as string) || 0,
        totalFixturesAvailable: parseInt(totalAvailable as string) || 0,
        selectedFixtureIds: selectedIds ? JSON.parse(selectedIds as string) : [],
        updateMethod: '10 random fixtures selected from today\'s matches',
        predictionSource: 'API-Football /predictions endpoint',
        lastUpdateStats: {
          age: `${cacheAgeMinutes} minutes ago`,
          freshness: status === 'fresh' ? 'good' : 'needs refresh',
          nextUpdateIn: status === 'fresh' 
            ? `${Math.max(0, 1440 - cacheAgeMinutes)} minutes` 
            : 'overdue'
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
      totalFixturesAvailable: 0,
      selectedFixtureIds: [],
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