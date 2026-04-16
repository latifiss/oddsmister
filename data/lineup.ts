// lineupData.ts

export interface Player {
  number: number;
  name: string;
  position?: string;
}

export interface TeamLineup {
  teamName: string;
  badgeUrl: string;
  manager: string;
  formation: string;
  primaryColor?: string;
  secondaryColor?: string;
  goalkeeper: Player;
  defenders: Player[];
  midfielders: Player[];
  attackers: Player[];
}

export const homeTeamData: TeamLineup = {
  teamName: 'Arsenal',
  badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  manager: 'Mikel Arteta',
  formation: '4-3-3',
  primaryColor: '#ef0107',
  secondaryColor: '#ffffff',
  goalkeeper: { number: 22, name: 'Raya' },
  defenders: [
    { number: 12, name: 'Timber' },
    { number: 6, name: 'Gabriel' },
    { number: 2, name: 'Saliba' },
    { number: 33, name: 'Calafiori' }
  ],
  midfielders: [
    { number: 8, name: 'Ødegaard' },
    { number: 41, name: 'Rice' },
    { number: 23, name: 'Merino' }
  ],
  attackers: [
    { number: 7, name: 'Saka' },
    { number: 29, name: 'Havertz' },
    { number: 11, name: 'Martinelli' }
  ]
};

export const awayTeamData: TeamLineup = {
  teamName: 'Chelsea',
  badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  manager: 'Enzo Maresca',
  formation: '4-2-3-1',
  primaryColor: '#034694',
  secondaryColor: '#ffffff',
  goalkeeper: { number: 1, name: 'Sanchez' },
  defenders: [
    { number: 24, name: 'James', position: 'RB' },
    { number: 6, name: 'Colwill', position: 'CB' },
    { number: 5, name: 'Badiashile', position: 'CB' },
    { number: 3, name: 'Cucurella', position: 'LB' }
  ],
  midfielders: [
    { number: 8, name: 'Fernandez', position: 'CM' },
    { number: 25, name: 'Caicedo', position: 'CDM' }
  ],
  attackers: [
    { number: 11, name: 'Madueke', position: 'RW' },
    { number: 20, name: 'Palmer', position: 'CAM' },
    { number: 10, name: 'Mudryk', position: 'LW' },
    { number: 15, name: 'Jackson', position: 'ST' }
  ]
};