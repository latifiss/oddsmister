import { Metadata } from 'next';
import LivescoreClient from './client';
import { apiClient } from '@/lib/api/apiFootballClient';

interface PageProps {
  searchParams?: Promise<{ date?: string; competition?: string }>;
}

async function getMatches(date?: string) {
  try {
    const dateStr = date || new Date().toISOString().split('T')[0];
    const data = await apiClient.getCached('fixtures', { date: dateStr }, { ttl: 300 });
    return data.response || [];
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return [];
  }
}

async function getLiveMatches() {
  try {
    const data = await apiClient.getCached('fixtures', { live: 'all' }, { ttl: 60 });
    return data.response || [];
  } catch (error) {
    console.error('Failed to fetch live matches:', error);
    return [];
  }
}

async function getAllPredictions(matches: any[]) {
  try {
    const fetchPromises = matches.slice(0, 10).map(async (match: any) => {
      try {
        const data = await apiClient.getCached('predictions', { fixture: match.fixture.id }, { ttl: 3600 });
        return { fixtureId: match.fixture.id, prediction: data.response?.[0] || null };
      } catch {
        return { fixtureId: match.fixture.id, prediction: null };
      }
    });
    
    const results = await Promise.all(fetchPromises);
    const predictionsMap: Record<number, any> = {};
    results.forEach(result => {
      predictionsMap[result.fixtureId] = result.prediction;
    });
    return predictionsMap;
  } catch (error) {
    console.error('Failed to fetch predictions:', error);
    return {};
  }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const date = params?.date ? new Date(params.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Today';
  
  const competition = params?.competition || 'All Competitions';
  
  return {
    title: `${competition} Live Scores & Match Results | ${date} | OddS Mister`,
    description: `Live football scores, match results, and betting odds for ${competition} on ${date}. Stay updated with real-time scores from major leagues including Premier League, La Liga, Bundesliga, and more.`,
    keywords: `live scores, football scores, match results, ${competition}, soccer scores, live football, betting odds`,
    openGraph: {
      title: `Live Football Scores - ${date}`,
      description: `Real-time scores and match updates from ${competition}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Live Scores - ${date}`,
      description: `Real-time football scores and updates`,
    },
  };
}

export default async function LivescorePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedDate = params?.date ? new Date(params.date) : new Date();
  const selectedCompetition = params?.competition || null;
  
  const dateStr = selectedDate.toISOString().split('T')[0];
  
  const [matches, liveMatches] = await Promise.all([
    getMatches(dateStr),
    getLiveMatches(),
  ]);
  
  const allMatches = [...liveMatches, ...matches];
  const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.fixture.id, m])).values());
  
  const predictionsMap = await getAllPredictions(uniqueMatches.slice(0, 10));
  
  const competitionLeagueIds: Record<string, number> = {
    'Premier League': 39,
    'La Liga': 140,
    'Bundesliga': 78,
    'Serie A': 135,
    'Ligue 1': 61,
    'MLS': 253,
    'Uefa Champions League': 2,
    'World Cup': 1,
    'Europa League': 3,
    'Conference League': 128,
  };
  
  let filteredMatches = uniqueMatches;
  if (selectedCompetition) {
    const targetLeagueId = competitionLeagueIds[selectedCompetition];
    if (targetLeagueId) {
      filteredMatches = uniqueMatches.filter(match => match.league.id === targetLeagueId);
    } else {
      filteredMatches = uniqueMatches.filter(match => match.league.name === selectedCompetition);
    }
  }
  
  const groups: Record<number, any> = {};
  filteredMatches.forEach((match) => {
    const leagueId = match.league.id;
    if (!groups[leagueId]) {
      groups[leagueId] = {
        leagueId,
        leagueName: match.league.name,
        leagueLogo: match.league.logo,
        country: match.league.country || '',
        matches: []
      };
    }
    groups[leagueId].matches.push(match);
  });
  
  const groupedMatches = Object.values(groups);
  
  return (
    <LivescoreClient 
      initialMatches={uniqueMatches}
      initialGroupedMatches={groupedMatches}
      initialPredictionsMap={predictionsMap}
      initialSelectedDate={selectedDate.toISOString()}
      initialSelectedCompetition={selectedCompetition}
    />
  );
}