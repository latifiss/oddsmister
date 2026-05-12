import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiFootballClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  }
  
  try {
    const data = await apiClient.getCached('fixtures', { id }, { ttl: 300 });
    
    return NextResponse.json({
      fixtureId: id,
      exists: !!data.response?.[0],
      resultCount: data.response?.length || 0,
      data: data.response?.[0] || null,
      fullResponse: data
    });
  } catch (error) {
    return NextResponse.json({ 
      fixtureId: id,
      exists: false, 
      error: String(error) 
    }, { status: 500 });
  }
}