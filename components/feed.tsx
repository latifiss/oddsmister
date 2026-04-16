'use client';

import { useMatches, useLiveMatches } from '@/hooks/useFootballData';
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import ScoreBoard from './scoreBoard';
import Image from 'next/image';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LeagueSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const LeagueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.adBg};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 4px;
`;

const LeagueLogo = styled(Image)`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const LeagueName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CountryName = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.grayText};
  margin-left: 6px;
`;

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MatchDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.grayText};
  font-size: 14px;
`;

interface FeedProps {
  selectedDate?: Date;
  selectedCompetition?: string | null;
}

interface GroupedMatch {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  country: string;
  matches: any[];
}

const competitionLeagueIds: Record<string, number> = {
  'Premier League': 39,
  'La Liga': 140,
  'Bundesliga': 78,
  'Serie A': 135,
  'Ligue 1': 61,
  'MLS': 253,
  'Uefa Champions League': 2,
  'World Cup': 1,
  'Europa League': 3,
  'Conference League': 128,
};

export default function Feed({ selectedDate, selectedCompetition }: FeedProps) {
  const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
  const { matches, isLoading, isError } = useMatches(dateStr);
  const { liveMatches } = useLiveMatches();

  const filteredAndGroupedMatches = useMemo(() => {
    const allMatches = [...liveMatches, ...matches];
    const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.fixture.id, m])).values());
    
    let filteredMatches = uniqueMatches;
    
    if (selectedCompetition) {
      const targetLeagueId = competitionLeagueIds[selectedCompetition];
      if (targetLeagueId) {
        filteredMatches = uniqueMatches.filter(
          match => match.league.id === targetLeagueId
        );
      } else {
        const targetName = selectedCompetition;
        filteredMatches = uniqueMatches.filter(
          match => match.league.name === targetName
        );
      }
    }
    
    if (filteredMatches.length === 0) {
      return { groups: [], hasMatches: false };
    }
    
    const groups: Record<number, GroupedMatch> = {};
    const priorityGroups: GroupedMatch[] = [];
    const otherGroups: GroupedMatch[] = [];
    
    if (selectedCompetition) {
      filteredMatches.forEach((match) => {
        const leagueId = match.league.id;
        if (!groups[leagueId]) {
          groups[leagueId] = {
            leagueId,
            leagueName: match.league.name,
            leagueLogo: match.league.logo,
            country: match.league.country || '',
            matches: []
          };
        }
        groups[leagueId].matches.push(match);
      });
      
      return { groups: Object.values(groups), hasMatches: true };
    }
    
    uniqueMatches.forEach((match) => {
      const leagueId = match.league.id;
      if (!groups[leagueId]) {
        groups[leagueId] = {
          leagueId,
          leagueName: match.league.name,
          leagueLogo: match.league.logo,
          country: match.league.country || '',
          matches: []
        };
      }
      groups[leagueId].matches.push(match);
    });
    
    const priorityLeagueIds = Object.values(competitionLeagueIds);
    
    Object.values(groups).forEach(group => {
      const isPriority = priorityLeagueIds.includes(group.leagueId);
      if (isPriority) {
        priorityGroups.push(group);
      } else {
        otherGroups.push(group);
      }
    });
    
    priorityGroups.sort((a, b) => a.leagueName.localeCompare(b.leagueName));
    otherGroups.sort((a, b) => a.leagueName.localeCompare(b.leagueName));
    
    return { groups: [...priorityGroups, ...otherGroups], hasMatches: uniqueMatches.length > 0 };
  }, [matches, liveMatches, selectedCompetition]);

  if (isLoading) return <LoadingSpinner>Loading matches...</LoadingSpinner>;
  if (isError) return <LoadingSpinner>Error loading matches</LoadingSpinner>;

  if (selectedCompetition && !filteredAndGroupedMatches.hasMatches) {
    return (
      <NoMatchesMessage>
        No {selectedCompetition} matches available today
      </NoMatchesMessage>
    );
  }

  if (!filteredAndGroupedMatches.hasMatches && !selectedCompetition) {
    return <NoMatchesMessage>No matches available for this date</NoMatchesMessage>;
  }

  return (
    <Container>
      {filteredAndGroupedMatches.groups.map((group) => (
        <LeagueSection key={group.leagueId}>
          <LeagueHeader>
            {group.leagueLogo && (
              <LeagueLogo 
                src={group.leagueLogo} 
                alt={group.leagueName}
                width={24}
                height={24}
              />
            )}
            <LeagueName>
              {group.leagueName}
              {group.country && <CountryName>• {group.country}</CountryName>}
            </LeagueName>
          </LeagueHeader>
          <MatchesList>
            {group.matches.map((match, index) => (
              <React.Fragment key={match.fixture.id}>
                <ScoreBoard
                  fixtureId={match.fixture.id}
                  homeTeam={match.teams.home.name}
                  awayTeam={match.teams.away.name}
                  homeImage={match.teams.home.logo}
                  awayImage={match.teams.away.logo}
                  date={new Date(match.fixture.date).toLocaleDateString()}
                  time={new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  homeScore={match.goals.home?.toString()}
                  awayScore={match.goals.away?.toString()}
                  homeRedCard={match.teams.home.redCard}
                  awayRedCard={match.teams.away.redCard}
                  status={match.fixture.status.short}
                  minute={match.fixture.status.elapsed}
                  isSuperboostAvailable={Math.random() < 0.3}
                />
                {index < group.matches.length - 1 && <MatchDivider />}
              </React.Fragment>
            ))}
          </MatchesList>
        </LeagueSection>
      ))}
    </Container>
  );
}