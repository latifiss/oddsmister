import { stat } from "fs";

export const match = [
  {
    competition: "Premier League",
    homeTeam: "Man United",
    awayTeam: "Liverpool",
    homeImage: "https://img.sofascore.com/api/v1/team/35/image",
    awayImage: "https://img.sofascore.com/api/v1/team/44/image",
    date: "2025-09-07",
    time: "18:30",
    homeScore: "2",
    awayScore: "1",
    matchTime: "75'",
    status: "postponed",
    homeRedCard: "0",
    awayRedCard: "0",
  },
  {
    competition: "La Liga",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeImage: "https://img.sofascore.com/api/v1/team/2829/image",
    awayImage: "https://img.sofascore.com/api/v1/team/2817/image",
    date: "2025-09-08",
    time: "20:00",
    homeScore: "0",
    awayScore: "0",
    matchTime: "HT",
    status: "live",
     homeRedCard: "0",
    awayRedCard: "0",
    channelName: ["supersport football plus", "canal plus sport 1"],
    channelImageSrc: "/channels/ss-football-plus.png",
  },
  {
    competition: "Serie A",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    homeImage: "https://img.sofascore.com/api/v1/team/2687/image",
    awayImage: "https://img.sofascore.com/api/v1/team/2692/image",
    date: "2025-09-09",
    time: "19:45",
    homeScore: "3",
    awayScore: "2",
    matchTime: "FT",
    status: "ended",
      homeRedCard: "0",
    awayRedCard: "1",
  },
  {
    competition: "Bundesliga",
    homeTeam: "Bayern",
    awayTeam: "Dortmund",
    homeImage: "https://img.sofascore.com/api/v1/team/2672/image",
    awayImage: "https://img.sofascore.com/api/v1/team/2673/image",
    date: "2025-09-10",
    time: "17:30",
    homeScore: "43",
    awayScore: "1",
    matchTime: "60'",
    status: "not_started",
      homeRedCard: "0",
    awayRedCard: "2",
    channelName: ["tv3", "max tv", "adesa plus"],
    channelImageSrc: "/channels/tv3.png",
  },
  {
    competition: "Ligue 1",
    homeTeam: "Toulouse",
    awayTeam: "Lens",
    homeImage: "https://img.sofascore.com/api/v1/team/1681/image",
    awayImage: "https://img.sofascore.com/api/v1/team/1648/image",
    date: "2025-09-10",
    time: "17:30",
    homeScore: "43",
    awayScore: "1",
    matchTime: "60'",
    status: "not_started",
      homeRedCard: "0",
    awayRedCard: "2",
    channelName: ["sporty tv"],
    channelImageSrc: "/channels/tv3.png",
  },
  {
    competition: "Serie A",
    homeTeam: "Cagiliari",
    awayTeam: "AC Milan",
    homeImage: "https://img.sofascore.com/api/v1/team/2719/image",
    awayImage: "https://img.sofascore.com/api/v1/team/2692/image",
    date: "2025-09-10",
    time: "17:30",
    homeScore: "43",
    awayScore: "1",
    matchTime: "60'",
    status: "not_started",
      homeRedCard: "0",
    awayRedCard: "2",
    channelName: ["startimes world football"],
    channelImageSrc: "/channels/tv3.png",
  }
];


export const homeTeamForm = [
  {
    team: "Man United",
    image: "https://img.sofascore.com/api/v1/team/35/image",
    score: "2",
    result: "W"
  },
  {
    team: "Real Madrid",
    image: "https://img.sofascore.com/api/v1/team/2829/image",
    score: "0",
    result: "D"
  },
  {
    team: "Juventus",
    image: "https://img.sofascore.com/api/v1/team/2687/image",
    score: "3",
    result: "W"
  },
  {
    team: "Bayern",
    image: "https://img.sofascore.com/api/v1/team/2672/image",
    score: "4",
    result: "W"
  },
  {
    team: "Arsenal",
    image: "https://img.sofascore.com/api/v1/team/42/image",
    score: "1",
    result: "L"
  }
];

export const awayTeamForm = [
  {
    team: "Liverpool",
    image: "https://img.sofascore.com/api/v1/team/44/image",
    score: "1",
    result: "L"
  },
  {
    team: "Barcelona",
    image: "https://img.sofascore.com/api/v1/team/2817/image",
    score: "0",
    result: "D"
  },
  {
    team: "AC Milan",
    image: "https://img.sofascore.com/api/v1/team/2692/image",
    score: "2",
    result: "L"
  },
  {
    team: "Dortmund",
    image: "https://img.sofascore.com/api/v1/team/2673/image",
    score: "1",
    result: "L"
  },
  {
    team: "Chelsea",
    image: "https://img.sofascore.com/api/v1/team/8/image",
    score: "2",
    result: "W"
  }
];


//--------------

// data/matches.ts

export interface Match {
  id: string;
  competition: {
    name: string;
    logo: string;
    country: string;
  };
  homeTeam: {
    name: string;
    badge: string;
    score?: number;
    redCards?: number;
    yellowCards?: number;
  };
  awayTeam: {
    name: string;
    badge: string;
    score?: number;
    redCards?: number;
    yellowCards?: number;
  };
  status: 'live' | 'ended' | 'not_started' | 'cancelled' | 'postponed' | 'finished' | 'halftime';
  date: string;
  time: string;
  minute?: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  isSuperboostAvailable?: boolean;
}

export const matches: Match[] = [
  // Live Matches
  {
    id: '1',
    competition: {
      name: 'English Premier League',
      logo: 'https://resources.premierleague.com/premierleague/badges/50/t8.png',
      country: 'England'
    },
    homeTeam: {
      name: 'Arsenal',
      badge: 'https://img.sofascore.com/api/v1/team/42/image',
      score: 2,
      redCards: 0,
      yellowCards: 2
    },
    awayTeam: {
      name: 'Chelsea',
      badge: 'https://img.sofascore.com/api/v1/team/43/image',
      score: 1,
      redCards: 0,
      yellowCards: 3
    },
    status: 'live',
    date: 'Today',
    time: '22:00',
    minute: 67,
    odds: {
      home: 2.10,
      draw: 3.40,
      away: 3.20
    },
    isSuperboostAvailable: true
  },
  {
    id: '2',
    competition: {
      name: 'UEFA Champions League',
      logo: 'https://img.uefa.com/imgml/ucl/2024/img/logos/logo.svg',
      country: 'Europe'
    },
    homeTeam: {
      name: 'Real Madrid',
      badge: 'https://img.sofascore.com/api/v1/team/5/image',
      score: 3,
      redCards: 0,
      yellowCards: 1
    },
    awayTeam: {
      name: 'Bayern Munich',
      badge: 'https://img.sofascore.com/api/v1/team/27/image',
      score: 1,
      redCards: 1,
      yellowCards: 2
    },
    status: 'live',
    date: 'Today',
    time: '21:00',
    minute: 78,
    odds: {
      home: 1.85,
      draw: 3.80,
      away: 4.20
    },
    isSuperboostAvailable: false
  },
  {
    id: '3',
    competition: {
      name: 'La Liga',
      logo: 'https://assets.laliga.com/assets/logo-laliga-2023-2.png',
      country: 'Spain'
    },
    homeTeam: {
      name: 'Barcelona',
      badge: 'https://img.sofascore.com/api/v1/team/3/image',
      score: 1,
      redCards: 0,
      yellowCards: 1
    },
    awayTeam: {
      name: 'Atletico Madrid',
      badge: 'https://img.sofascore.com/api/v1/team/12/image',
      score: 1,
      redCards: 0,
      yellowCards: 3
    },
    status: 'live',
    date: 'Today',
    time: '20:00',
    minute: 52,
    odds: {
      home: 2.20,
      draw: 3.30,
      away: 3.10
    },
    isSuperboostAvailable: true
  },

  // Upcoming / Not Started Matches
  {
    id: '4',
    competition: {
      name: 'English Premier League',
      logo: 'https://resources.premierleague.com/premierleague/badges/50/t8.png',
      country: 'England'
    },
    homeTeam: {
      name: 'Manchester City',
      badge: 'https://img.sofascore.com/api/v1/team/17/image'
    },
    awayTeam: {
      name: 'Liverpool',
      badge: 'https://img.sofascore.com/api/v1/team/9/image'
    },
    status: 'not_started',
    date: 'Tomorrow',
    time: '18:30',
    odds: {
      home: 1.95,
      draw: 3.60,
      away: 3.80
    },
    isSuperboostAvailable: true
  },
  {
    id: '5',
    competition: {
      name: 'Serie A',
      logo: 'https://img.legaseriea.it/vimages/62c12d6b/Serie_A_Logo.png',
      country: 'Italy'
    },
    homeTeam: {
      name: 'Inter Milan',
      badge: 'https://img.sofascore.com/api/v1/team/46/image'
    },
    awayTeam: {
      name: 'AC Milan',
      badge: 'https://img.sofascore.com/api/v1/team/47/image'
    },
    status: 'not_started',
    date: 'Tomorrow',
    time: '20:45',
    odds: {
      home: 2.30,
      draw: 3.40,
      away: 2.90
    },
    isSuperboostAvailable: false
  },
  {
    id: '6',
    competition: {
      name: 'Bundesliga',
      logo: 'https://assets.dfb.de/images/dfb/logo-bundesliga.png',
      country: 'Germany'
    },
    homeTeam: {
      name: 'Borussia Dortmund',
      badge: 'https://img.sofascore.com/api/v1/team/28/image'
    },
    awayTeam: {
      name: 'RB Leipzig',
      badge: 'https://img.sofascore.com/api/v1/team/29/image'
    },
    status: 'not_started',
    date: 'Sat, 12 Apr',
    time: '15:30',
    odds: {
      home: 2.15,
      draw: 3.50,
      away: 3.20
    },
    isSuperboostAvailable: true
  },

  // Finished Matches
  {
    id: '7',
    competition: {
      name: 'English Premier League',
      logo: 'https://resources.premierleague.com/premierleague/badges/50/t8.png',
      country: 'England'
    },
    homeTeam: {
      name: 'Tottenham',
      badge: 'https://img.sofascore.com/api/v1/team/44/image',
      score: 4
    },
    awayTeam: {
      name: 'Manchester United',
      badge: 'https://img.sofascore.com/api/v1/team/15/image',
      score: 1
    },
    status: 'finished',
    date: 'Yesterday',
    time: '16:00',
    odds: {
      home: 2.40,
      draw: 3.50,
      away: 2.70
    },
    isSuperboostAvailable: false
  },
  {
    id: '8',
    competition: {
      name: 'UEFA Europa League',
      logo: 'https://www.uefa.com/imgml/uefaeuropaleague/2024/img/logos/logo.svg',
      country: 'Europe'
    },
    homeTeam: {
      name: 'Roma',
      badge: 'https://img.sofascore.com/api/v1/team/101/image',
      score: 2
    },
    awayTeam: {
      name: 'Bayer Leverkusen',
      badge: 'https://img.sofascore.com/api/v1/team/32/image',
      score: 2
    },
    status: 'finished',
    date: 'Yesterday',
    time: '21:00',
    odds: {
      home: 2.80,
      draw: 3.40,
      away: 2.50
    },
    isSuperboostAvailable: false
  },

  // Halftime Matches
  {
    id: '9',
    competition: {
      name: 'Ligue 1',
      logo: 'https://www.ligue1.fr/medias/logos/ligue1-logo.png',
      country: 'France'
    },
    homeTeam: {
      name: 'PSG',
      badge: 'https://img.sofascore.com/api/v1/team/48/image',
      score: 2,
      yellowCards: 1
    },
    awayTeam: {
      name: 'Marseille',
      badge: 'https://img.sofascore.com/api/v1/team/50/image',
      score: 0,
      yellowCards: 2,
      redCards: 1
    },
    status: 'halftime',
    date: 'Today',
    time: '20:00',
    minute: 45,
    odds: {
      home: 1.45,
      draw: 4.50,
      away: 6.00
    },
    isSuperboostAvailable: true
  },
  {
    id: '10',
    competition: {
      name: 'Eredivisie',
      logo: 'https://eredivisie.eu/wp-content/uploads/2021/09/Eredivisie-logo.png',
      country: 'Netherlands'
    },
    homeTeam: {
      name: 'Ajax',
      badge: 'https://img.sofascore.com/api/v1/team/120/image',
      score: 0,
      yellowCards: 2
    },
    awayTeam: {
      name: 'Feyenoord',
      badge: 'https://img.sofascore.com/api/v1/team/121/image',
      score: 0,
      yellowCards: 1
    },
    status: 'halftime',
    date: 'Today',
    time: '19:00',
    minute: 45,
    odds: {
      home: 2.10,
      draw: 3.40,
      away: 3.30
    },
    isSuperboostAvailable: false
  },

  // Postponed / Cancelled Matches
  {
    id: '11',
    competition: {
      name: 'English Premier League',
      logo: 'https://resources.premierleague.com/premierleague/badges/50/t8.png',
      country: 'England'
    },
    homeTeam: {
      name: 'Newcastle',
      badge: 'https://img.sofascore.com/api/v1/team/60/image'
    },
    awayTeam: {
      name: 'Everton',
      badge: 'https://img.sofascore.com/api/v1/team/61/image'
    },
    status: 'postponed',
    date: 'Postponed',
    time: 'TBD',
    odds: {
      home: 0,
      draw: 0,
      away: 0
    },
    isSuperboostAvailable: false
  },
  {
    id: '12',
    competition: {
      name: 'La Liga',
      logo: 'https://assets.laliga.com/assets/logo-laliga-2023-2.png',
      country: 'Spain'
    },
    homeTeam: {
      name: 'Valencia',
      badge: 'https://img.sofascore.com/api/v1/team/13/image'
    },
    awayTeam: {
      name: 'Real Betis',
      badge: 'https://img.sofascore.com/api/v1/team/14/image'
    },
    status: 'cancelled',
    date: 'Cancelled',
    time: '-',
    odds: {
      home: 0,
      draw: 0,
      away: 0
    },
    isSuperboostAvailable: false
  }
];