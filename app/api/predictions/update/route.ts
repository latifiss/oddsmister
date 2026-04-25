import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// API-Football configuration
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_FOOTBALL_HOST = 'v3.football.api-sports.io';

export async function GET() {
  try {
    console.log('🔄 Predictions update started at:', new Date().toISOString());
    
    if (!API_FOOTBALL_KEY) {
      throw new Error('API_FOOTBALL_KEY is not configured');
    }
    
    // 1. Fetch today's fixtures
    const today = new Date().toISOString().split('T')[0];
    const fixturesResponse = await fetch(
      `https://${API_FOOTBALL_HOST}/fixtures?date=${today}&timezone=GMT`,
      {
        headers: {
          'x-rapidapi-key': API_FOOTBALL_KEY,
          'x-rapidapi-host': API_FOOTBALL_HOST
        }
      }
    );
    
    const fixturesData = await fixturesResponse.json();
    const allFixtures = fixturesData.response || [];
    
    console.log(`📊 Found ${allFixtures.length} total fixtures for ${today}`);
    
    if (allFixtures.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No fixtures found for today',
        timestamp: new Date().toISOString(),
        fixturesProcessed: 0
      });
    }
    
    // 2. Randomly select 10 matches
    const NUMBER_TO_PROCESS = 10;
    const shuffled = [...allFixtures];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selectedFixtures = shuffled.slice(0, Math.min(NUMBER_TO_PROCESS, allFixtures.length));
    
    console.log(`🎲 Randomly selected ${selectedFixtures.length} fixtures to fetch predictions for`);
    
    // 3. Fetch predictions for each selected fixture using API-Football's predictions endpoint
    const predictionsData = [];
    
    for (const fixture of selectedFixtures) {
      try {
        // Call API-Football's predictions endpoint
        const predictionsResponse = await fetch(
          `https://${API_FOOTBALL_HOST}/predictions?fixture=${fixture.fixture.id}`,
          {
            headers: {
              'x-rapidapi-key': API_FOOTBALL_KEY,
              'x-rapidapi-host': API_FOOTBALL_HOST
            }
          }
        );
        
        const predictionsApiData = await predictionsResponse.json();
        const predictions = predictionsApiData.response || [];
        
        // Store prediction with fixture metadata
        predictionsData.push({
          fixtureId: fixture.fixture.id,
          fixture: {
            homeTeam: fixture.teams.home.name,
            awayTeam: fixture.teams.away.name,
            date: fixture.fixture.date,
            venue: fixture.fixture.venue?.name || 'Unknown',
            status: fixture.fixture.status.short
          },
          league: {
            id: fixture.league.id,
            name: fixture.league.name,
            country: fixture.league.country,
            logo: fixture.league.logo
          },
          predictions: predictions, // This is the actual API-Football predictions data
          lastUpdated: new Date().toISOString()
        });
        
        // Add delay to respect rate limits (500ms between requests)
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error fetching predictions for fixture ${fixture.fixture.id}:`, error);
        continue;
      }
    }
    
    // 4. Store in Redis with 24 hour expiry
    await redis.set('predictions_feed', JSON.stringify(predictionsData), { ex: 86400 });
    await redis.set('predictions_last_update', new Date().toISOString());
    await redis.set('predictions_fixture_count', predictionsData.length);
    await redis.set('predictions_total_available', allFixtures.length);
    await redis.set('predictions_selected_ids', JSON.stringify(selectedFixtures.map(f => f.fixture.id)));
    
    const result = {
      success: true,
      message: `Successfully fetched predictions for ${predictionsData.length} random fixtures`,
      timestamp: new Date().toISOString(),
      fixturesProcessed: predictionsData.length,
      totalFixturesAvailable: allFixtures.length,
      nextUpdateIn: '24 hours'
    };
    
    console.log('✅ Update completed:', result);
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    return NextResponse.json(
      { 
        error: 'Update failed', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}