'use client'

import React from 'react';
import styled from 'styled-components';

interface ComparisonData {
  form: { home: string; away: string };
  att: { home: string; away: string };
  def: { home: string; away: string };
  poisson_distribution: { home: string; away: string };
  h2h: { home: string; away: string };
  goals: { home: string; away: string };
  total: { home: string; away: string };
}

interface MatchComparisonProps {
  data: ComparisonData;
  homeTeam: string;
  awayTeam: string;
  homeBadge?: string;
  awayBadge?: string;
  homeColor?: string;
  awayColor?: string;
}

const Wrapper = styled.div`
  width: 100%;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Team = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.img`
  width: 22px;
  height: 22px;
`;

const TeamName = styled.span<{ $color: string }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const Vs = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.grayText};
  font-weight: 600;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Value = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayText};
  text-align: center;
  flex: 1;
`;

const Bar = styled.div`
  position: relative;
  height: 8px;
  border-radius: 2px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.alto};
`;

const Fill = styled.div<{ $home: number; $homeColor: string; $awayColor: string }>`
  display: flex;
  width: 100%;
  height: 100%;
`;

const HomeSide = styled.div<{ $width: number; $color: string }>`
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
`;

const AwaySide = styled.div<{ $width: number; $color: string }>`
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
`;

const Divider = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #fff;
  opacity: 0.6;
`;

const Total = styled.div`
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalValue = styled.div<{ $color: string }>`
  font-size: 22px;
  font-weight: 800;
  color: ${({ $color }) => $color};
`;

const MatchComparison: React.FC<MatchComparisonProps> = ({
  data,
  homeTeam,
  awayTeam,
  homeBadge,
  awayBadge,
  homeColor = '#ef0107',
  awayColor = '#034694',
}) => {

  const categories = [
    { key: 'form', label: 'Form' },
    { key: 'att', label: 'Attack' },
    { key: 'def', label: 'Defense' },
    { key: 'poisson_distribution', label: 'xG' },
    { key: 'h2h', label: 'H2H' },
    { key: 'goals', label: 'Goals' },
  ];

  const get = (v: string) => parseFloat(v.replace('%', ''));

  return (
    <Wrapper>
      <Header>
        <Team>
          {homeBadge && <Badge src={homeBadge} />}
          <TeamName $color={homeColor}>{homeTeam}</TeamName>
        </Team>

        <Vs>VS</Vs>

        <Team>
          <TeamName $color={awayColor}>{awayTeam}</TeamName>
          {awayBadge && <Badge src={awayBadge} />}
        </Team>
      </Header>

      <List>
        {categories.map((c) => {
          const item = data[c.key as keyof ComparisonData];
          const home = get(item.home);
          const away = get(item.away);

          return (
            <Row key={c.key}>
              <Top>
                <Value $color={homeColor}>{home}%</Value>
                <Label>{c.label}</Label>
                <Value $color={awayColor}>{away}%</Value>
              </Top>

              <Bar>
                <Fill $home={home} $homeColor={homeColor} $awayColor={awayColor}>
                  <HomeSide $width={home} $color={homeColor} />
                  <AwaySide $width={away} $color={awayColor} />
                </Fill>

                <Divider style={{ left: `${home}%` }} />
              </Bar>
            </Row>
          );
        })}
      </List>

      <Total>
        <TotalValue $color={homeColor}>
          {Math.round(get(data.total.home))}%
        </TotalValue>

        <Label>Total</Label>

        <TotalValue $color={awayColor}>
          {Math.round(get(data.total.away))}%
        </TotalValue>
      </Total>
    </Wrapper>
  );
};

export default MatchComparison;