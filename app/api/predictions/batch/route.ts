import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/cache/redisClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fixtureIds = searchParams.get('fixtureIds')?.split(',') || [];

  if (!fixtureIds.length) {
    return NextResponse.json({ error: 'Fixture IDs required' }, { status: 400 });
  }

  const startTime = Date.now();
  
  try {
    const predictions: Record<number, unknown> = {};
    const missingIds: number[] = [];
    
    const pipeline = redis.pipeline();
    for (const fixtureId of fixtureIds) {
      pipeline.get(`prediction:${fixtureId}`);
    }
    
    const results = await pipeline.exec();
    
    results?.forEach((result, index) => {
      const fixtureId = parseInt(fixtureIds[index]);
      if (result && result[1]) {
        predictions[fixtureId] = JSON.parse(result[1] as string);
      } else {
        missingIds.push(fixtureId);
      }
    });
    
    console.log(`📊 Batch results: ${Object.keys(predictions).length} from cache, ${missingIds.length} missing`);
    
    if (missingIds.length > 0) {
      console.log(`🔄 Fetching ${missingIds.length} missing predictions from API...`);
      
      const { apiClient } = await import('@/lib/api/apiFootballClient');
      
      for (const fixtureId of missingIds) {
        try {
          const data = await apiClient.getCached('predictions', { fixture: fixtureId }, { ttl: 43200 });
          if (data.response && data.response[0]) {
            predictions[fixtureId] = data.response[0];
            await redis.setex(
              `prediction:${fixtureId}`,
              24 * 60 * 60,
              JSON.stringify(data.response[0])
            );
          }
          // Add delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to fetch prediction for ${fixtureId}:`, error);
        }
      }
    }
    
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      predictions,
      fromCache: missingIds.length === 0,
      cached: missingIds.length === 0,
      duration,
      total: Object.keys(predictions).length
    });
  } catch (error) {
    console.error('Batch predictions error:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}