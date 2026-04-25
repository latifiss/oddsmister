import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('🔄 Predictions update started at:', new Date().toISOString());
    
    // Check if Redis is available
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      console.error('❌ Redis not configured');
      return NextResponse.json(
        { error: 'Redis not configured', message: 'Missing UPSTASH_REDIS_REST_URL' },
        { status: 500 }
      );
    }
    
    // Your update logic here (simplified for testing)
    const mockPredictions = [
      {
        id: 1,
        fixture: "Arsenal vs Chelsea",
        prediction: "Home Win",
        confidence: 75,
        timestamp: new Date().toISOString()
      }
    ];
    
    // Store in Redis
    await redis.set('predictions', JSON.stringify(mockPredictions), { ex: 86400 });
    await redis.set('predictions_last_update', new Date().toISOString());
    await redis.set('predictions_fixture_count', mockPredictions.length);
    
    const result = {
      success: true,
      message: 'Predictions updated successfully',
      timestamp: new Date().toISOString(),
      fixturesProcessed: mockPredictions.length,
      predictionsGenerated: mockPredictions.length
    };
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    return NextResponse.json(
      { error: 'Update failed', details: error.message },
      { status: 500 }
    );
  }
}