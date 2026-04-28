import { Metadata } from 'next';
import LivescoreClient from './client';

interface PageProps {
  searchParams?: Promise<{ date?: string; competition?: string }>;
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
  const selectedCompetition = params?.competition || null;
  const selectedDate = params?.date ? new Date(params.date) : new Date();
  
  return (
    <LivescoreClient 
      initialSelectedDate={selectedDate.toISOString()}
      initialSelectedCompetition={selectedCompetition}
    />
  );
}