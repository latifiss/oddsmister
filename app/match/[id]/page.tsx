import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MatchDetailClient from './matchClient';
import { apiClient } from '@/lib/api/apiFootballClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMatchData(fixtureId: number) {
  try {
    const data = await apiClient.getCached('fixtures', { id: fixtureId }, { ttl: 300 });
    return data.response?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch match data for ${fixtureId}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const fixtureId = parseInt(id);
  const match = await getMatchData(fixtureId);
  
  if (!match) {
    return {
      title: 'Match Not Found',
      description: 'The requested match could not be found',
    };
  }
  
  const homeTeam = match.teams.home.name;
  const awayTeam = match.teams.away.name;
  const leagueName = match.league.name;
  const matchDate = new Date(match.fixture.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const scoreText = match.goals.home !== null && match.goals.away !== null
    ? `${match.goals.home} - ${match.goals.away}`
    : 'vs';
  
  return {
    title: `${homeTeam} vs ${awayTeam} - Match Preview & Odds | OddS Mister`,
    description: `Get the latest match preview, live scores, betting odds, and predictions for ${homeTeam} vs ${awayTeam} in the ${leagueName}. Match date: ${matchDate}.`,
    keywords: `${homeTeam}, ${awayTeam}, football, soccer, match preview, betting odds, predictions, ${leagueName}`,
    openGraph: {
      title: `${homeTeam} vs ${awayTeam} - Match Preview & Odds`,
      description: `Live scores, betting odds, and predictions for ${homeTeam} vs ${awayTeam}`,
      type: 'website',
      images: [
        {
          url: match.teams.home.logo,
          width: 120,
          height: 120,
          alt: homeTeam,
        },
        {
          url: match.teams.away.logo,
          width: 120,
          height: 120,
          alt: awayTeam,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${homeTeam} vs ${awayTeam} - Match Preview`,
      description: `Live scores: ${scoreText} | Get the latest odds and predictions`,
    },
    alternates: {
      canonical: `/matches/${fixtureId}`,
    },
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const fixtureId = parseInt(id);

  if (Number.isNaN(fixtureId)) {
    notFound();
  }
  
  return (
    <MatchDetailClient 
      fixtureId={fixtureId}
      initialMatch={null}
      initialPredictions={null}
      initialOdds={null}
      initialMatches={[]}
      matchesLoading
      matchesError={false}
    />
  );
}