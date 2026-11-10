import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const league = searchParams.get('league');
  const live = searchParams.get('live');
  const fixtureId = searchParams.get('fixtureId');

  if (fixtureId && (!/^\d+$/.test(fixtureId) || Number(fixtureId) <= 0)) {
    return NextResponse.json({ error: 'A valid fixtureId is required' }, { status: 400 });
  }
  if (!fixtureId && live !== 'true' && !DATE_PATTERN.test(date)) {
    return NextResponse.json({ error: 'Date must use YYYY-MM-DD format' }, { status: 400 });
  }
  if (league && (!/^\d+$/.test(league) || Number(league) <= 0)) {
    return NextResponse.json({ error: 'League must be a valid numeric ID' }, { status: 400 });
  }

  try {
    const data = fixtureId
      ? await apiClient.getCached('fixtures', { id: Number(fixtureId) }, { ttl: 120 })
      : live === 'true'
        ? await apiClient.getCached('fixtures', { live: 'all' }, { ttl: 30 })
        : await apiClient.getCached(
            'fixtures',
            { date, ...(league ? { league: Number(league) } : {}) },
            { ttl: 300 }
          );

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (error) {
    console.error('[api/matches] Failed to fetch matches:', error);
    return NextResponse.json({ error: 'Unable to retrieve matches right now' }, { status: 502 });
  }
}
