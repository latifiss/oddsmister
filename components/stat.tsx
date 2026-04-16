'use client';

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : 'transparent'};
  border-radius: 1px;
  border: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.border : 'transparent'};
  padding: 16px;
  font-family: inherit;

  height: auto;
  min-height: auto;
  max-height: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 16px;
`;

const TeamName = styled.span<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme?.colors?.text};
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const DonutWrapper = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
`;

const Donut = styled.div<{ percent: number }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #ffd300 ${({ percent }) => percent}%,
    #000 ${({ percent }) => percent}% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DonutHole = styled.div<{ $isActive: boolean }>`
  width: 60%;
  height: 60%;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.white};
  border-radius: 50%;
`;

const DonutText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
`;

const StatRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
`;

const StatLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme?.colors?.text};
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

const StatSpan = styled.div`
  color: ${({ theme }) => theme?.colors?.text};
`

const BarWrapper = styled.div`
  flex: 1;
  height: 10px;
  background: #f3f3f3;
  margin: 0 14px;
  border-radius: 0px;
  display: flex;
  overflow: hidden;
`;

const Bar = styled.div<{ value: number; color: string }>`
  height: 100%;
  width: ${({ value }) => value}%;
  background: ${({ color }) => color};
`;

interface PageProps {
    isActive: boolean
}

const Stat = ({isActive}: PageProps) => {
  const stats = {
    possession: 54.4,
    xG: { home: 1.62, away: 0.22 },
    shots: { home: 16, away: 5 },
    shotsOnTarget: { home: 5, away: 1 },
    redCards: { home: 0, away: 1 },
    yellowCards: { home: 2, away: 3 },
    offsides: { home: 1, away: 0 },
    fouls: { home: 8, away: 12 },
  };

  const totals = {
    xG: stats.xG.home + stats.xG.away,
    shots: stats.shots.home + stats.shots.away,
    shotsOnTarget: stats.shotsOnTarget.home + stats.shotsOnTarget.away,
    redCards: stats.redCards.home + stats.redCards.away,
    yellowCards: stats.yellowCards.home + stats.yellowCards.away,
    offsides: stats.offsides.home + stats.offsides.away,
    fouls: stats.fouls.home + stats.fouls.away,
  };

  const renderBarRow = (label: string, home: number, away: number, total: number) => (
    <StatRow>
      <StatLabel>{label}</StatLabel>
      <BarRow>
        <StatSpan style={{ fontWeight: '500', fontSize: '16px', width: '40px', textAlign: 'right' }}>{home}</StatSpan>
        <BarWrapper>
          <Bar value={total === 0 ? 0 : (home / total) * 100} color="#FFD300" />
          <Bar value={total === 0 ? 0 : (away / total) * 100} color="#000" />
        </BarWrapper>
        <StatSpan style={{ fontWeight: '500', fontSize: '16px',  width: '40px', textAlign: 'left' }}>{away}</StatSpan>
      </BarRow>
    </StatRow>
  );

  return (
    <Wrapper $isActive={isActive}>
      <Header>
        <TeamName color="#FFD300">Arsenal</TeamName>
        <TeamName color="#000">Key</TeamName>
        <TeamName color="#000">Nottm Forest</TeamName>
      </Header>

      <ChartContainer>
        <DonutWrapper>
          <Donut percent={stats.possession}>
            <DonutHole $isActive={isActive}/>
          </Donut>
          <DonutText>
            <div>Overall possession</div>
          </DonutText>
        </DonutWrapper>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', width: '80%' }}>
          <span style={{ color: '#FFD300', fontWeight: '700' }}>{stats.possession}%</span>
          <span style={{ color: '#000', fontWeight: '700' }}>{(100 - stats.possession).toFixed(1)}%</span>
        </div>
      </ChartContainer>

      {renderBarRow('xG', stats.xG.home, stats.xG.away, totals.xG)}
      {renderBarRow('Shots', stats.shots.home, stats.shots.away, totals.shots)}
      {renderBarRow('Shots on Target', stats.shotsOnTarget.home, stats.shotsOnTarget.away, totals.shotsOnTarget)}
      {renderBarRow('Red Cards', stats.redCards.home, stats.redCards.away, totals.redCards)}
      {renderBarRow('Yellow Cards', stats.yellowCards.home, stats.yellowCards.away, totals.yellowCards)}
      {renderBarRow('Offsides', stats.offsides.home, stats.offsides.away, totals.offsides)}
      {renderBarRow('Fouls', stats.fouls.home, stats.fouls.away, totals.fouls)}
    </Wrapper>
  );
};

export default Stat;
