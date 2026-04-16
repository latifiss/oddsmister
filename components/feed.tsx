'use client';

import React from 'react'
import styled from 'styled-components';
import OddScoreItem from './oddScoreItem';
import OddScoreHead from './oddScoreHead';
import { matches, Match } from '@/data/matches';

const ScoreWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const ScoreContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  padding: 2px 0px 12px 0px;

  & > *:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    width: 100%;
  }
`;

const CompetitionGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`;

const Feed = () => {
  const groupedMatches = matches.reduce((groups, match) => {
    const compKey = match.competition.name;
    if (!groups[compKey]) {
      groups[compKey] = {
        competition: match.competition,
        matches: []
      };
    }
    groups[compKey].matches.push(match);
    return groups;
  }, {} as Record<string, { competition: Match['competition']; matches: Match[] }>);

  return (
    <ScoreWrapper>
      {Object.values(groupedMatches).map((group) => (
        <CompetitionGroup key={group.competition.name}>
          <OddScoreHead 
            logo={group.competition.logo} 
            competition={group.competition.name}
            country={group.competition.country}
          />
          <ScoreContent>
            {group.matches.map((match) => (
              <OddScoreItem
                key={match.id}
                homeTeam={match.homeTeam.name}
                awayTeam={match.awayTeam.name}
                homeImage={match.homeTeam.badge}
                awayImage={match.awayTeam.badge}
                date={match.date}
                time={match.time}
                homeScore={match.homeTeam.score?.toString()}
                awayScore={match.awayTeam.score?.toString()}
                homeRedCard={match.homeTeam.redCards}
                awayRedCard={match.awayTeam.redCards}
                status={match.status}
                isActive={true}
                minute={match.minute}
                isSuperboostAvailable={match.isSuperboostAvailable}
              />
            ))}
          </ScoreContent>
        </CompetitionGroup>
      ))}
    </ScoreWrapper>
  );
}

export default Feed;