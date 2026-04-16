import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fixtureId = searchParams.get('fixtureId');

  if (!fixtureId) {
    return NextResponse.json({ error: 'Fixture ID required' }, { status: 400 });
  }

  try {
    const data = await apiClient.getCached('odds', { fixture: fixtureId }, { ttl: 18000 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch odds' }, { status: 500 });
  }
}