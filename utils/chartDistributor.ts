export type ChartType = 'winProbability' | 'goalLine' | 'dualGauge';

export const chartTypes: ChartType[] = [
  'winProbability',
  'goalLine',
  'dualGauge'
];

export function distributeCharts(matchCount: number): ChartType[] {
  const distribution: ChartType[] = [];
  
  const counts = {
    winProbability: Math.ceil(matchCount * 0.4),
    goalLine: Math.ceil(matchCount * 0.3),
    dualGauge: Math.ceil(matchCount * 0.3)
  };
  
  for (let i = 0; i < counts.winProbability; i++) distribution.push('winProbability');
  for (let i = 0; i < counts.goalLine; i++) distribution.push('goalLine');
  for (let i = 0; i < counts.dualGauge; i++) distribution.push('dualGauge');
  
  for (let i = distribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
  }
  
  return distribution.slice(0, matchCount);
}