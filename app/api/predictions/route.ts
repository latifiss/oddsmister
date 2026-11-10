import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

export async function GET(request: NextRequest) {
  const fixtureId = request.nextUrl.searchParams.get('fixtureId');

  if (!fixtureId || !/^\d+$/.test(fixtureId) || Number(fixtureId) <= 0) {
    return NextResponse.json({ error: 'A valid fixtureId is required' }, { status: 400 });
  }

  try {
    const data = await apiClient.getCached(
      'predictions',
      { fixture: Number(fixtureId) },
      { ttl: 1800 }
    );
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' },
    });
  } catch (error) {
    console.error('[api/predictions] Failed to fetch predictions:', error);
    return NextResponse.json({ error: 'Unable to retrieve predictions right now' }, { status: 502 });
  }
}
