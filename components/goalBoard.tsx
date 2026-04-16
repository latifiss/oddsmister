'use client';

import React from 'react';
import styled from 'styled-components';
import { matchIncidents } from '../data/incidents';

const Container = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0px 1px 3px rgba(0,0,0,0.05);
`;

const Column = styled.div<{ align?: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => (align === 'right' ? 'flex-end' : 'flex-start')};
  flex: 1; 
`;

const Goal = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
`;

const GoalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
    gap: 8px;
    width: 100%;
`

const GoalRowLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
    gap: 8px;
    width: 100%;
`

const Scorer = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Emoji = styled.span`
  font-size: 13px;
`;

const Time = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.grayText};
`;

export default function GoalsBlock() {
  const goals = matchIncidents.data.incidents.filter(
    (incident) =>
      incident.incidentType === 'goal' || incident.incidentType === 'inGamePenalty'
  );

  const homeGoals = goals.filter((g) => g.isHome === true);
  const awayGoals = goals.filter((g) => g.isHome === false);

  return (
    <Container>
      <Column align="left">
        {homeGoals.map((goal, index) => (
            <Goal key={`home-${index}`}>
                <GoalRowLeft>
            <Scorer><Emoji>⚽</Emoji> {goal.player?.name}</Scorer>
                    <Time>{goal.time}'</Time>
                </GoalRowLeft>
          </Goal>
        ))}
      </Column>

      <Column align="right">
        {awayGoals.map((goal, index) => (
            <Goal key={`away-${index}`}>
                <GoalRow>
            <Scorer><Emoji>⚽</Emoji> {goal.player?.name}</Scorer>
            <Time>{goal.time}'</Time>
                </GoalRow>
          </Goal>
        ))}
      </Column>
    </Container>
  );
}
