// page.tsx or where you want to use the component
'use client'

import OddsDetailScreen from '@/components/oddsDetailScreen';

const matchInfo = {
  homeTeam: 'Arsenal',
  awayTeam: 'Chelsea',
  homeBadge: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  awayBadge: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  league: 'English Premier League',
  leagueBadge: 'https://resources.premierleague.com/premierleague/badges/50/t8.png',
  date: 'Saturday, 7 Apr 2026',
  time: '22:00',
  venue: 'Emirates Stadium',
};

export default function Page() {
  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <OddsDetailScreen matchInfo={matchInfo} />
    </div>
  );
}