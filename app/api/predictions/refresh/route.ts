import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/cache/redisClient';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const keys = await redis.keys('prediction:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Cleared ${keys.length} prediction caches`);
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/cron/update-predictions`, {
      headers: { 'Authorization': `Bearer ${secret}` }
    });
    
    const data = await response.json();
    
    return NextResponse.json({ 
      message: 'Cache refreshed successfully',
      cleared: keys.length,
      ...data 
    });
  } catch (error) {
    console.error('Refresh failed:', error);
    return NextResponse.json({ error: 'Failed to refresh cache' }, { status: 500 });
  }
}