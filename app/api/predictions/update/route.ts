import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_FOOTBALL_HOST = 'v3.football.api-sports.io';

export async function GET() {
  const startTime = Date.now();
  
  try {
    if (!API_FOOTBALL_KEY) {
      throw new Error('API_FOOTBALL_KEY is not configured');
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const fixturesResponse = await fetch(
      `https://${API_FOOTBALL_HOST}/fixtures?date=${today}&timezone=GMT`,
      {
        headers: {
          'x-rapidapi-key': API_FOOTBALL_KEY,
          'x-rapidapi-host': API_FOOTBALL_HOST
        },
        next: { revalidate: 0 }
      }
    );
    
    if (!fixturesResponse.ok) {
      throw new Error(`API-Football responded with status: ${fixturesResponse.status}`);
    }
    
    const fixturesData = await fixturesResponse.json();
    const allFixtures = fixturesData.response || [];
    
    if (allFixtures.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No fixtures found for today',
        timestamp: new Date().toISOString(),
        fixturesProcessed: 0,
        totalFixturesAvailable: 0
      });
    }
    
    const NUMBER_TO_PROCESS = 10;
    const shuffled = [...allFixtures];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selectedFixtures = shuffled.slice(0, Math.min(NUMBER_TO_PROCESS, allFixtures.length));
    
    const predictionsData = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < selectedFixtures.length; i++) {
      const fixture = selectedFixtures[i];
      
      try {
        const predictionsResponse = await fetch(
          `https://${API_FOOTBALL_HOST}/predictions?fixture=${fixture.fixture.id}`,
          {
            headers: {
              'x-rapidapi-key': API_FOOTBALL_KEY,
              'x-rapidapi-host': API_FOOTBALL_HOST
            },
            next: { revalidate: 0 }
          }
        );
        
        if (!predictionsResponse.ok) {
          errorCount++;
          continue;
        }
        
        const predictionsApiData = await predictionsResponse.json();
        const predictions = predictionsApiData.response || [];
        
        predictionsData.push({
          fixtureId: fixture.fixture.id,
          fixture: {
            id: fixture.fixture.id,
            homeTeam: fixture.teams.home.name,
            awayTeam: fixture.teams.away.name,
            homeLogo: fixture.teams.home.logo,
            awayLogo: fixture.teams.away.logo,
            date: fixture.fixture.date,
            venue: fixture.fixture.venue?.name || 'Unknown',
            status: fixture.fixture.status.short,
            elapsed: fixture.fixture.status.elapsed || null
          },
          league: {
            id: fixture.league.id,
            name: fixture.league.name,
            country: fixture.league.country,
            logo: fixture.league.logo,
            season: fixture.league.season
          },
          predictions: predictions,
          hasPredictions: predictions && predictions.length > 0,
          lastUpdated: new Date().toISOString()
        });
        
        successCount++;
        
        if (i < selectedFixtures.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 600));
        }
        
      } catch (error) {
        errorCount++;
        continue;
      }
    }
    
    await redis.set('predictions_feed', JSON.stringify(predictionsData), { ex: 86400 });
    await redis.set('predictions_last_update', new Date().toISOString());
    await redis.set('predictions_fixture_count', predictionsData.length);
    await redis.set('predictions_total_available', allFixtures.length);
    await redis.set('predictions_selected_ids', JSON.stringify(selectedFixtures.map(f => f.fixture.id)));
    await redis.set('predictions_success_count', successCount);
    await redis.set('predictions_error_count', errorCount);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    const result = {
      success: true,
      message: `Successfully fetched predictions for ${successCount} random fixtures`,
      timestamp: new Date().toISOString(),
      fixturesProcessed: predictionsData.length,
      totalFixturesAvailable: allFixtures.length,
      successCount: successCount,
      errorCount: errorCount,
      durationSeconds: parseFloat(duration),
      nextUpdateIn: '24 hours',
      selectedFixtureIds: selectedFixtures.map(f => f.fixture.id)
    };
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'CDN-Cache-Control': 'no-cache'
      },
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Update failed', 
        details: errorMessage,
        timestamp: new Date().toISOString(),
        fixturesProcessed: 0
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  }
}

export async function POST() {
  return GET();
}