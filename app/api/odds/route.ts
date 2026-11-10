import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

export async function GET(request: NextRequest) {
  const fixtureId = request.nextUrl.searchParams.get('fixtureId');

  if (!fixtureId || !/^\d+$/.test(fixtureId) || Number(fixtureId) <= 0) {
    return NextResponse.json({ error: 'A valid fixtureId is required' }, { status: 400 });
  }

  try {
    const data = await apiClient.getCached(
      'odds',
      { fixture: Number(fixtureId) },
      { ttl: 300 }
    );
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('[api/odds] Failed to fetch odds:', error);
    return NextResponse.json({ error: 'Unable to retrieve odds right now' }, { status: 502 });
  }
}
