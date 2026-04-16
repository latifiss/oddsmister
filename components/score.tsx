'use client'

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Sport = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1;
`;

const Region = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.altText};
  margin: 0;
  line-height: 1;
`;

const DateTime = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  text-transform: uppercase;
  font-style: italic;
  white-space: nowrap;
  margin: 0;
  line-height: 1;
`;

const MatchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 12px;
  align-items: center;
  width: 100%;
`;

const TeamColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TeamIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: ${({ theme }) => theme.colors.stroke};
  border-radius: 4px;
`;

const TeamName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1;
`;

const OddValue = styled.p<{ isHighlight?: boolean }>`
  font-size: 13px;
  font-weight: ${({ isHighlight }) => (isHighlight ? '600' : '500')};
  color: ${({ theme, isHighlight }) =>
    isHighlight ? theme.colors.selectText : theme.colors.text};
  background: ${({ theme, isHighlight }) =>
    isHighlight ? theme.colors.selectBg : 'transparent'};
  padding: ${({ isHighlight }) => (isHighlight ? '4px 8px' : '0')};
  border-radius: ${({ isHighlight }) => (isHighlight ? '4px' : '0')};
  margin: 0;
  line-height: 1;
  min-width: 50px;
  text-align: center;
`;

const DropValue = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.red};
  margin: 0;
  line-height: 1;
  min-width: 60px;
  text-align: right;
`;

interface ScoreProps {
  sport?: string;
  region?: string;
  dateTime?: string;
  team1?: string;
  team1Icon?: string;
  team1Odds?: [number, number, number];
  team2?: string;
  team2Icon?: string;
  team2Odds?: [number, number, number];
  dropPercentage?: number;
  sportIcon?: string;
}

const Score = ({
  sport = 'Football',
  region = 'South America',
  dateTime = '7 Apr, 22:00',
  team1 = 'Barracas',
  team1Icon = '⚽',
  team1Odds = [3.30, 3.25, 2.20],
  team2 = 'Vasco',
  team2Icon = '⚽',
  team2Odds = [1.95, 3.20, 4.33],
  dropPercentage = 40.9,
  sportIcon = '🏟️',
}: ScoreProps) => {
  return (
    <Container>
      <Header>
        <IconWrapper>{sportIcon}</IconWrapper>
        <HeaderText>
          <Sport>{sport}</Sport>
          <Region>{region}</Region>
        </HeaderText>
      </Header>

      <DateTime>{dateTime}</DateTime>

      <MatchRow>
        <TeamColumn>
          <TeamIcon>{team1Icon}</TeamIcon>
          <TeamName>{team1}</TeamName>
        </TeamColumn>
        <OddValue isHighlight>{team1Odds[0]}</OddValue>
        <OddValue>{team1Odds[1]}</OddValue>
        <OddValue>{team1Odds[2]}</OddValue>
        <DropValue>{dropPercentage}%</DropValue>
      </MatchRow>

      <MatchRow>
        <TeamColumn>
          <TeamIcon>{team2Icon}</TeamIcon>
          <TeamName>{team2}</TeamName>
        </TeamColumn>
        <OddValue>{team2Odds[0]}</OddValue>
        <OddValue isHighlight>{team2Odds[1]}</OddValue>
        <OddValue>{team2Odds[2]}</OddValue>
        <DropValue>{dropPercentage}%</DropValue>
      </MatchRow>
    </Container>
  );
};

export default Score;
