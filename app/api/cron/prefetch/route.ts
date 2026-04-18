import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { apiClient } from '@/lib/api/apiFootballClient';

const redis = Redis.fromEnv();

export const dynamic = 'force-dynamic';

async function shouldRun() {
  const lastRun = await redis.get('last_prefetch_run');
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  if (lastRun && parseInt(lastRun as string) > oneHourAgo) {
    return false;
  }
  
  await redis.set('last_prefetch_run', Date.now());
  return true;
}

async function getPopularMatches() {
  try {
    const popularLeagueIds = [39, 140, 78, 135, 61, 2, 3];
    const today = new Date().toISOString().split('T')[0];
    const data = await apiClient.getCached('fixtures', { date: today }, { ttl: 300 });
    const matches = data.response || [];
    
    return matches.filter((match: any) => 
      popularLeagueIds.includes(match.league.id) && match.fixture.status.short === 'NS'
    ).slice(0, 15);
  } catch (error) {
    console.error('Failed to fetch popular matches:', error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!await shouldRun()) {
      return NextResponse.json({ message: 'Skipped - already ran recently' });
    }
    
    console.log('Starting pre-fetch job...');
    
    const matches = await getPopularMatches();
    
    const results = await Promise.allSettled(
      matches.map(async (match: any) => {
        await apiClient.getCached('predictions', { fixture: match.fixture.id }, { ttl: 3600 });
        await apiClient.getCached('odds', { fixture: match.fixture.id }, { ttl: 300 });
        return match.fixture.id;
      })
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    return NextResponse.json({
      success: true,
      preFetched: successful,
      total: matches.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Pre-fetch failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}