import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

export async function GET() {
  try {
    const data = await apiClient.getCached('leagues', {}, { ttl: 86400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leagues' }, { status: 500 });
  }
}