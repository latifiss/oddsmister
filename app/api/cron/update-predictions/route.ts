import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';
import { redis } from '@/lib/cache/redisClient';

export async function GET(request: NextRequest) {
  // Security: Check for secret token
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  
  try {
    console.log('🔄 Starting daily predictions update...');
    
    // Get today's matches
    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Fetching matches for ${today}`);
    
    const matchesData = await apiClient.getCached('fixtures', { date: today }, { ttl: 300 });
    const matches = matchesData.response || [];
    
    // Also get tomorrow's matches for early preparation
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const tomorrowMatchesData = await apiClient.getCached('fixtures', { date: tomorrow }, { ttl: 300 });
    const tomorrowMatches = tomorrowMatchesData.response || [];
    
    const allMatches = [...matches, ...tomorrowMatches];
    
    // Get unique fixture IDs (limit to 30 to stay within free tier limits)
    const fixtureIds = [...new Set(allMatches.map((match: any) => match.fixture.id))].slice(0, 30);
    
    console.log(`📊 Found ${fixtureIds.length} unique fixtures to fetch predictions for`);
    
    // Fetch predictions for each fixture
    const predictionsMap: Record<number, any> = {};
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < fixtureIds.length; i++) {
      const fixtureId = fixtureIds[i];
      try {
        console.log(`🔄 Fetching prediction for fixture ${fixtureId} (${i + 1}/${fixtureIds.length})`);
        
        const data = await apiClient.getCached('predictions', { fixture: fixtureId }, { ttl: 43200 });
        
        if (data.response && data.response[0]) {
          predictionsMap[fixtureId] = data.response[0];
          successCount++;
          console.log(`✅ Fetched prediction for fixture ${fixtureId}`);
        } else {
          failCount++;
          console.log(`⚠️ No prediction data for fixture ${fixtureId}`);
        }
        
        // Add delay between requests to avoid rate limiting (1 second between requests)
        if (i < fixtureIds.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        failCount++;
        console.error(`❌ Failed to fetch prediction for ${fixtureId}:`, error);
      }
    }
    
    // Store predictions in Upstash Redis with 24-hour expiry
    const expirySeconds = 24 * 60 * 60; // 24 hours
    let cachedCount = 0;
    
    console.log('💾 Saving predictions to Upstash Redis...');
    
    for (const [fixtureId, prediction] of Object.entries(predictionsMap)) {
      await redis.setex(
        `prediction:${fixtureId}`,
        expirySeconds,
        JSON.stringify(prediction)
      );
      cachedCount++;
    }
    
    // Store metadata about last update
    await redis.setex(
      'predictions:last_update',
      expirySeconds,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        fixtureCount: fixtureIds.length,
        successCount,
        failCount,
        date: today,
        duration: Date.now() - startTime
      })
    );
    
    // Store list of all cached fixture IDs for easy reference
    await redis.setex(
      'predictions:cached_fixtures',
      expirySeconds,
      JSON.stringify(Object.keys(predictionsMap))
    );
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Daily predictions update completed in ${duration}ms`);
    console.log(`📊 Stats: Success: ${successCount}, Failed: ${failCount}, Cached: ${cachedCount}`);
    
    return NextResponse.json({
      success: true,
      stats: {
        cached: cachedCount,
        success: successCount,
        failed: failCount,
        total: fixtureIds.length
      },
      duration,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json({ 
      error: 'Failed to update predictions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}