import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fixtureId = searchParams.get('fixtureId');
    
    // Read predictions from cache
    const cachedData = await redis.get('predictions_feed').catch(() => null);
    const lastUpdate = await redis.get('predictions_last_update').catch(() => null);
    
    if (!cachedData) {
      return NextResponse.json({
        success: false,
        message: 'No predictions available. Cache is empty. Run /api/predictions/update first.',
        predictions: null,
        lastUpdate: null
      });
    }
    
    // Safely parse cached data
    let predictions = [];
    try {
      if (typeof cachedData === 'string') {
        predictions = JSON.parse(cachedData);
      } else if (Array.isArray(cachedData)) {
        predictions = cachedData;
      } else {
        predictions = [];
      }
    } catch (parseError) {
      console.error('Failed to parse feed data:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Cache data is corrupted',
        predictions: null,
        error: 'Parse error'
      });
    }
    
    // If fixtureId is provided, return specific prediction
    if (fixtureId) {
      const fixturePrediction = predictions.find(
        (p: any) => p.fixtureId === parseInt(fixtureId)
      );
      
      if (!fixturePrediction) {
        return NextResponse.json({
          success: false,
          message: `No prediction found for fixture ${fixtureId}`,
          prediction: null
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Prediction retrieved from cache',
        prediction: fixturePrediction,
        cachedAt: lastUpdate
      });
    }
    
    // Return all predictions
    return NextResponse.json({
      success: true,
      message: 'Predictions retrieved from cache',
      predictions: predictions,
      total: predictions.length,
      lastUpdate: lastUpdate,
      cacheInfo: {
        totalFixturesProcessed: predictions.length,
        cacheExpiry: '24 hours',
        lastUpdateTime: lastUpdate ? new Date(lastUpdate as string).toLocaleString() : null
      }
    });
    
  } catch (error) {
    console.error('Feed endpoint error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve predictions',
        message: error instanceof Error ? error.message : 'Unknown error',
        predictions: null
      },
      { status: 500 }
    );
  }
}