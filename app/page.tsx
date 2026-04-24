import { Metadata } from 'next';
import { Suspense } from 'react';
import LivescoreClient from './client';
import { apiClient } from '@/lib/api/apiFootballClient';

interface PageProps {
  searchParams?: Promise<{ date?: string; competition?: string }>;
}

interface Match {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number };
    venue: { name: string; city: string };
    referee: string | null;
  };
  teams: {
    home: { name: string; logo: string; redCard?: number };
    away: { name: string; logo: string; redCard?: number };
  };
  goals: { home: number | null; away: number | null };
  league: { id: number; name: string; logo: string; country: string; season: number; round: string };
}

interface GroupedMatch {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  country: string;
  matches: Match[];
}

const priorityLeagueIds = [39, 140, 78, 135, 61, 2, 3, 848];

// Cache configuration
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = 'force-static';

async function getMatches(date?: string): Promise<Match[]> {
  try {
    const dateStr = date || new Date().toISOString().split('T')[0];
    const data = await apiClient.getCached('fixtures', { date: dateStr }, { ttl: 300 });
    return data.response || [];
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return [];
  }
}

async function getLiveMatches(): Promise<Match[]> {
  try {
    const data = await apiClient.getCached('fixtures', { live: 'all' }, { ttl: 60 });
    return data.response || [];
  } catch (error) {
    console.error('Failed to fetch live matches:', error);
    return [];
  }
}

function groupMatches(matches: Match[], selectedCompetition: string | null = null): GroupedMatch[] {
  let filteredMatches = matches;
  
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
  
  if (selectedCompetition) {
    const targetLeagueId = competitionLeagueIds[selectedCompetition];
    if (targetLeagueId) {
      filteredMatches = matches.filter(match => match.league.id === targetLeagueId);
    } else {
      filteredMatches = matches.filter(match => match.league.name === selectedCompetition);
    }
  }
  
  const groups: Record<number, GroupedMatch> = {};
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
  
  groupedMatches.sort((a, b) => {
    const aIndex = priorityLeagueIds.indexOf(a.leagueId);
    const bIndex = priorityLeagueIds.indexOf(b.leagueId);
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    if (aIndex !== -1) {
      return -1;
    }
    
    if (bIndex !== -1) {
      return 1;
    }
    
    return a.leagueName.localeCompare(b.leagueName);
  });
  
  return groupedMatches;
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '280px 1fr 350px', 
        gap: '24px',
        alignItems: 'start'
      }}>
        <div style={{ 
          background: '#f5f5f5', 
          borderRadius: '12px', 
          padding: '20px',
          height: '500px'
        }} />
        <div>
          <div style={{ 
            background: '#f5f5f5', 
            borderRadius: '8px', 
            padding: '20px',
            marginBottom: '20px',
            height: '100px'
          }} />
          <div style={{ 
            background: '#f5f5f5', 
            borderRadius: '8px', 
            padding: '20px',
            height: '400px'
          }} />
        </div>
        <div style={{ 
          background: '#f5f5f5', 
          borderRadius: '12px', 
          padding: '20px',
          height: '500px'
        }} />
      </div>
    </div>
  );
}

// Main page component with streaming
export default async function LivescorePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedDate = params?.date ? new Date(params.date) : new Date();
  const selectedCompetition = params?.competition || null;
  const dateStr = selectedDate.toISOString().split('T')[0];
  
  // Fetch initial data (matches only, no predictions)
  const [matches, liveMatches] = await Promise.all([
    getMatches(dateStr),
    getLiveMatches(),
  ]);
  
  const allMatches = [...liveMatches, ...matches];
  const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.fixture.id, m])).values());
  
  // Group matches for initial render
  const groupedMatches = groupMatches(uniqueMatches, selectedCompetition);
  
  // Return the client component with initial data (no predictions yet)
  return (
    <LivescoreClient 
      initialMatches={uniqueMatches}
      initialGroupedMatches={groupedMatches}
      initialPredictionsMap={{}}
      initialSelectedDate={selectedDate.toISOString()}
      initialSelectedCompetition={selectedCompetition}
    />
  );
}