const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_FOOTBALL_HOST = 'v3.football.api-sports.io';

export async function fetchFixtures() {
  const response = await fetch(`https://${API_FOOTBALL_HOST}/fixtures?date=${getTodayDate()}`, {
    headers: {
      'x-rapidapi-key': API_FOOTBALL_KEY!,
      'x-rapidapi-host': API_FOOTBALL_HOST
    }
  });
  
  const data = await response.json();
  return data.response || [];
}

export async function fetchOdds(fixtureId: number) {
  const response = await fetch(`https://${API_FOOTBALL_HOST}/odds?fixture=${fixtureId}`, {
    headers: {
      'x-rapidapi-key': API_FOOTBALL_KEY!,
      'x-rapidapi-host': API_FOOTBALL_HOST
    }
  });
  
  const data = await response.json();
  return data.response || [];
}

export function generatePredictions(fixtures: any[], oddsData: any[]) {
  // Your prediction logic here
  return fixtures.map(fixture => ({
    fixtureId: fixture.fixture.id,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    prediction: 'Home Win', // Your logic here
    confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
    odds: oddsData.find(o => o.fixtureId === fixture.fixture.id)?.odds || null
  }));
}

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}