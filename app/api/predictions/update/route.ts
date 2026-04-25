import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import {
  fetchFixtures,
  fetchOdds,
  generatePredictions,
} from '@/lib/api-football';

// CRITICAL: Disable caching for cron-triggered endpoints
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('🔄 Predictions update started at:', new Date().toISOString());

    // Check rate limits
    const rateLimitRemaining = await redis.get('rate_limit_remaining');
    if (rateLimitRemaining && parseInt(rateLimitRemaining) < 5) {
      return NextResponse.json(
        {
          error: 'Rate limit too low',
          remaining: rateLimitRemaining,
          message: 'Skipping update to preserve API quota',
        },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        },
      );
    }

    // Fetch today's fixtures
    const fixtures = await fetchFixtures();
    console.log(`📊 Fetched ${fixtures.length} fixtures`);

    // Fetch odds for each fixture
    const oddsData = [];
    for (const fixture of fixtures.slice(0, 10)) {
      // Limit to 10 to save API calls
      const odds = await fetchOdds(fixture.id);
      oddsData.push({ fixtureId: fixture.id, odds });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Rate limit delay
    }

    // Generate predictions
    const predictions = generatePredictions(fixtures, oddsData);
    console.log(`🎯 Generated ${predictions.length} predictions`);

    // Store in Redis
    await redis.set('predictions', JSON.stringify(predictions), { ex: 86400 }); // 24 hour expiry
    await redis.set('predictions_last_update', new Date().toISOString());
    await redis.set('predictions_fixture_count', fixtures.length);

    const result = {
      success: true,
      message: 'Predictions updated successfully',
      timestamp: new Date().toISOString(),
      fixturesProcessed: fixtures.length,
      predictionsGenerated: predictions.length,
      cacheExpiry: '24 hours',
    };

    console.log('✅ Predictions update completed:', result);

    // Return with no-cache headers
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('❌ Predictions update failed:', error);

    return NextResponse.json(
      {
        error: 'Update failed',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  }
}

// Also support POST method for flexibility
export async function POST() {
  return GET();
}
