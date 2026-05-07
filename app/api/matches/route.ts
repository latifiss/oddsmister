import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

interface FixturesParams {
  date?: string;
  league?: string;
  live?: string;
  id?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const league = searchParams.get('league');
  const live = searchParams.get('live');
  const fixtureId = searchParams.get('fixtureId');

  try {
    let data;
    if (fixtureId) {
      data = await apiClient.getCached('fixtures', { id: fixtureId }, { ttl: 300 });
    } else if (live === 'true') {
      data = await apiClient.getCached('fixtures', { live: 'all' }, { ttl: 120 });
    } else {
      const params: FixturesParams = { date };
      if (league) params.league = league;
      data = await apiClient.getCached('fixtures', params, { ttl: 3600 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}