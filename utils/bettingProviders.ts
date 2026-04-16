// utils/bettingProviders.ts

export interface BettingProvider {
  id: string;
  name: string;
  logoLight?: string;  // Light mode version (if different)
  logoDark?: string;   // Dark mode version (if different)
  logo?: string;       // Universal logo (works for both modes)
}

// List of all betting providers with their images
export const bettingProviders: BettingProvider[] = [
  {
    id: 'bet365',
    name: 'Bet365',
    logoLight: '/assets/betting-providers/bet365-light.png',
    logoDark: '/assets/betting-providers/bet365-dark.png',
  },
  {
    id: '10bet',
    name: '10Bet',
    logoLight: '/assets/betting-providers/10bet-light.png',
    logoDark: '/assets/betting-providers/10bet-dark.png',
  },
  {
    id: '1xbet',
    name: '1xBet',
    logoLight: '/assets/betting-providers/1xbet-light.png',
    logoDark: '/assets/betting-providers/1хbet-dark.png',
  },
  {
    id: '188bet',
    name: '188Bet',
    logo: '/assets/betting-providers/188bet.png', 
    },
    {
    id: 'betfred',
    name: 'betfred',
    logo: '/assets/betting-providers/betfred.png', 
    },
  {
    id: 'bwin',
    name: 'bwin',
    logoLight: '/assets/betting-providers/bwin-light.png',
    logoDark: '/assets/betting-providers/bwin-dark.png',
    },
  {
    id: 'dafabet',
    name: 'dafabet',
    logoLight: '/assets/betting-providers/dafabet-light.png',
    logoDark: '/assets/betting-providers/dafabet-dark.png',
    },
   {
    id: 'interwetten',
    name: 'interwetten',
    logo: '/assets/betting-providers/interwetten.png', 
    },
   {
    id: 'ladbrokes',
    name: 'ladbrokes',
    logo: '/assets/betting-providers/ladbrokes.png', 
    },
   {
    id: 'marathonbet',
    name: 'marathonbet',
    logo: '/assets/betting-providers/marathonbet.png', 
    },
   {
    id: 'pinnacle',
    name: 'pinnacle',
    logo: '/assets/betting-providers/pinnacle.jpeg', 
    },
   {
    id: 'unibet',
    name: 'unibet',
    logoLight: '/assets/betting-providers/unibet-light.png',
    logoDark: '/assets/betting-providers/unibet-dark.webp',
    },
   {
    id: 'william-hill',
    name: 'william-hill',
    logoLight: '/assets/betting-providers/william-hill-light.png',
    logoDark: '/assets/betting-providers/william-hill-dark.png',
    },
];

// Helper function to get provider logo based on theme
export const getProviderLogo = (providerId: string, theme: 'light' | 'dark'): string => {
  const provider = bettingProviders.find(p => p.id === providerId);
  
  if (!provider) {
    console.warn(`Provider ${providerId} not found`);
    return '';
  }
  
  // If provider has specific theme logos
  if (theme === 'light' && provider.logoLight) {
    return provider.logoLight;
  }
  if (theme === 'dark' && provider.logoDark) {
    return provider.logoDark;
  }
  
  // Fallback to universal logo
  if (provider.logo) {
    return provider.logo;
  }
  
  // If no logo found, try to use the light version as fallback
  return provider.logoLight || provider.logoDark || '';
};

// Helper function to get provider by ID
export const getProviderById = (id: string): BettingProvider | undefined => {
  return bettingProviders.find(provider => provider.id === id);
};

// Helper function to get provider by name
export const getProviderByName = (name: string): BettingProvider | undefined => {
  return bettingProviders.find(provider => provider.name.toLowerCase() === name.toLowerCase());
};