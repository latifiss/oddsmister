import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fixtureId = searchParams.get('fixtureId');
  const bookmakerId = searchParams.get('bookmakerId');
  const betId = searchParams.get('betId');

  if (!fixtureId) {
    return NextResponse.json({ error: 'Fixture ID required' }, { status: 400 });
  }

  try {
    const params: Record<string, any> = { fixture: fixtureId };
    if (bookmakerId) params.bookmaker = bookmakerId;
    if (betId) params.bet = betId;
    
    const data = await apiClient.getCached('odds', params, { ttl: 18000 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch odds' }, { status: 500 });
  }
}