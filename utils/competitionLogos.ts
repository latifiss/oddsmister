export interface Competition {
  id: string;
  name: string;
  logoLight?: string;
  logoDark?: string;
  logo?: string;
}

export const competitions: Competition[] = [
  {
    id: 'premier-league',
    name: 'Premier League',
    logoLight: '/assets/comp/light/premier-league.png',
    logoDark: '/assets/comp/dark/premier-league.png',
  },
  {
    id: 'laliga',
    name: 'La Liga',
    logoLight: '/assets/comp/light/laliga.png',
    logoDark: '/assets/comp/dark/laliga.png',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    logoLight: '/assets/comp/light/bundesliga.png',
    logoDark: '/assets/comp/dark/bundesliga.png',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    logoLight: '/assets/comp/light/serie-a.png',
    logoDark: '/assets/comp/dark/serie-a.png',
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    logoLight: '/assets/comp/light/ligue-1.png',
    logoDark: '/assets/comp/dark/ligue-1.png',
  },
  {
    id: 'mls',
    name: 'MLS',
    logoLight: '/assets/comp/light/mls.png',
    logoDark: '/assets/comp/dark/mls.png',
  },
  {
    id: 'uefa-champions-league',
    name: 'Uefa Champions League',
    logoLight: '/assets/comp/light/uefa-champions-league.png',
    logoDark: '/assets/comp/dark/uefa-champions-league.png',
  },
  {
    id: 'worldcup',
    name: 'World Cup',
    logoLight: '/assets/comp/light/worldcup.png',
    logoDark: '/assets/comp/dark/worldcup.png',
  },
  {
    id: 'uefa-europa-league',
    name: 'Europa League',
    logoLight: '/assets/comp/light/uefa-europa-league.png',
    logoDark: '/assets/comp/dark/uefa-europa-league.png',
  },
  {
    id: 'uefa-europa-conference-league',
    name: 'Conference League',
    logoLight: '/assets/comp/light/uefa-europa-conference-league.png',
    logoDark: '/assets/comp/dark/uefa-europa-conference-league.png',
  },
];

export const getCompetitionLogo = (competitionId: string, theme: 'light' | 'dark'): string => {
  const competition = competitions.find(c => c.id === competitionId);
  
  if (!competition) {
    console.warn(`Competition ${competitionId} not found`);
    return '';
  }
  
  if (theme === 'light' && competition.logoLight) {
    return competition.logoLight;
  }
  if (theme === 'dark' && competition.logoDark) {
    return competition.logoDark;
  }
  
  if (competition.logo) {
    return competition.logo;
  }
  
  return competition.logoLight || competition.logoDark || '';
};

export const getCompetitionById = (id: string): Competition | undefined => {
  return competitions.find(competition => competition.id === id);
};

export const getCompetitionByName = (name: string): Competition | undefined => {
  return competitions.find(competition => competition.name.toLowerCase() === name.toLowerCase());
};