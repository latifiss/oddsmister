import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fixtureId = searchParams.get('fixtureId');
    
    // Read predictions from cache (NOT from API directly)
    const cachedData = await redis.get('predictions_feed');
    
    if (!cachedData) {
      return NextResponse.json({
        success: false,
        message: 'No predictions available. Cache is empty. Cron job may not have run yet.',
        predictions: null,
        lastUpdate: null
      });
    }
    
    const predictions = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const lastUpdate = await redis.get('predictions_last_update');
    
    // If fixtureId is provided, return prediction for specific fixture
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
    
    // Otherwise return all predictions
    return NextResponse.json({
      success: true,
      message: 'Predictions retrieved from cache',
      predictions: predictions,
      total: predictions.length,
      lastUpdate: lastUpdate,
      cacheInfo: {
        totalFixturesProcessed: predictions.length,
        cacheExpiry: '24 hours'
      }
    });
    
  } catch (error) {
    console.error('Error reading predictions from cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve predictions',
        predictions: null
      },
      { status: 500 }
    );
  }
}