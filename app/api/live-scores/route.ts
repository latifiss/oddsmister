import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const activeMatches = new Map<number, NodeJS.Timeout>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fixtureId = searchParams.get('fixtureId');
  
  if (!fixtureId) {
    return NextResponse.json({ error: 'Fixture ID required' }, { status: 400 });
  }

  const id = parseInt(fixtureId);

  if (!activeMatches.has(id)) {
    startPollingMatch(id).catch(console.error);
  }

  return NextResponse.json({ 
    status: 'tracking_started', 
    fixtureId: id,
    message: 'Live updates will be available via SSE'
  });
}

async function startPollingMatch(fixtureId: number) {
  
  await fetchAndCacheMatch(fixtureId);
  
  const pollInterval = setInterval(async () => {
    await fetchAndCacheMatch(fixtureId);
  }, 60000);
  
  activeMatches.set(fixtureId, pollInterval);
}

async function fetchAndCacheMatch(fixtureId: number) {
  try {
    const data = await apiClient.getCached('fixtures', { id: fixtureId }, { ttl: 300 });
    const match = data.response?.[0];
    
    if (match) {
      await redis.set(`live:${fixtureId}`, match, { ex: 300 });
      
      const status = match.fixture.status.short;
      
      if (status === 'FT' || status === 'AET' || status === 'PEN') {
        const interval = activeMatches.get(fixtureId);
        if (interval) {
          clearInterval(interval);
          activeMatches.delete(fixtureId);
        }
      }
    }
  } catch (error) {
    console.error(`Polling error for match ${fixtureId}:`, error);
  }
}