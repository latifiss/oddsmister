export interface TransformedMatch {
  id: number;
  homeTeam: { name: string; badge: string; score?: number; redCards?: number };
  awayTeam: { name: string; badge: string; score?: number; redCards?: number };
  date: string;
  time: string;
  status: string;
  minute?: number;
  isLive: boolean;
  league: { id: number; name: string; round: string };
  odds?: any[];
}

export function transformAPIMatch(apiMatch: any): TransformedMatch {
  return {
    id: apiMatch.fixture.id,
    homeTeam: {
      name: apiMatch.teams.home.name,
      badge: apiMatch.teams.home.logo,
      score: apiMatch.goals.home,
      redCards: apiMatch.teams.home.redCard
    },
    awayTeam: {
      name: apiMatch.teams.away.name,
      badge: apiMatch.teams.away.logo,
      score: apiMatch.goals.away,
      redCards: apiMatch.teams.away.redCard
    },
    date: new Date(apiMatch.fixture.date).toLocaleDateString(),
    time: new Date(apiMatch.fixture.date).toLocaleTimeString(),
    status: apiMatch.fixture.status.short,
    minute: apiMatch.fixture.status.elapsed,
    isLive: ['1H', '2H', 'HT', 'ET', 'P'].includes(apiMatch.fixture.status.short),
    league: {
      id: apiMatch.league.id,
      name: apiMatch.league.name,
      round: apiMatch.league.round
    }
  };
}