// app/api/live-scores/route.ts
import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Store active intervals
const activeMatches = new Map<number, NodeJS.Timeout>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fixtureId = searchParams.get('fixtureId');
  
  if (!fixtureId) {
    return NextResponse.json({ error: 'Fixture ID required' }, { status: 400 });
  }

  const id = parseInt(fixtureId);

  // Start polling if not already polling
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
  console.log(`Started polling match ${fixtureId}`);
  
  // Poll immediately
  await fetchAndCacheMatch(fixtureId);
  
  // Then poll every 60 seconds
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
      // Store in Redis as object (no need to stringify - Upstash handles it)
      await redis.set(`live:${fixtureId}`, match, { ex: 300 });
      
      const status = match.fixture.status.short;
      console.log(`Updated match ${fixtureId}: ${status} - ${match.goals.home}:${match.goals.away}`);
      
      // Stop polling if match is finished
      if (status === 'FT' || status === 'AET' || status === 'PEN') {
        const interval = activeMatches.get(fixtureId);
        if (interval) {
          clearInterval(interval);
          activeMatches.delete(fixtureId);
          console.log(`Stopped polling match ${fixtureId} (finished)`);
        }
      }
    }
  } catch (error) {
    console.error(`Polling error for match ${fixtureId}:`, error);
  }
}