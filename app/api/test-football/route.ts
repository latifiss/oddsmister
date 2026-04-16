import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.API_FOOTBALL_KEY;
  
  const response = await fetch('https://v3.football.api-sports.io/odds/bookmakers', {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey!,
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  });

  const data = await response.json();
  
  return NextResponse.json({ 
    status: response.status,
    count: data.response?.length || 0,
    bookmakers: data.response?.slice(0, 5) 
  });
}