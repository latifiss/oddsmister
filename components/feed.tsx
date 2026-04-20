'use client';

import { useMatches, useLiveMatches } from '@/hooks/useFootballData';
import React, { useState, useMemo, useEffect } from 'react';
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
  initialMatches?: any[];
  initialGroupedMatches?: any[];
}

const priorityLeagueIds = [39, 140, 78, 135, 61, 2, 3, 848];

export default function Feed({ 
  selectedDate, 
  selectedCompetition,
  initialMatches = [],
  initialGroupedMatches = []
}: FeedProps) {
  const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
  const { matches, isLoading, isError } = useMatches(dateStr);
  const { liveMatches } = useLiveMatches();
  const [hasInitialData, setHasInitialData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isError && (matches.length > 0 || liveMatches.length > 0)) {
      setHasInitialData(false);
    }
  }, [matches, liveMatches, isLoading, isError]);

  const filteredAndGroupedMatches = useMemo(() => {
    if (hasInitialData && initialGroupedMatches.length > 0) {
      let filtered = [...initialGroupedMatches];
      
      if (selectedCompetition) {
        const leagueId = parseInt(selectedCompetition);
        filtered = filtered.filter(group => group.leagueId === leagueId);
      }
      
      filtered.sort((a: any, b: any) => {
        const aIndex = priorityLeagueIds.indexOf(a.leagueId);
        const bIndex = priorityLeagueIds.indexOf(b.leagueId);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        if (aIndex !== -1) {
          return -1;
        }
        
        if (bIndex !== -1) {
          return 1;
        }
        
        return a.leagueName.localeCompare(b.leagueName);
      });
      
      return { groups: filtered, hasMatches: filtered.length > 0 };
    }

    const allMatches = [...liveMatches, ...matches];
    const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.fixture.id, m])).values());
    
    let filteredMatches = uniqueMatches;
    
    if (selectedCompetition) {
      const leagueId = parseInt(selectedCompetition);
      filteredMatches = uniqueMatches.filter(match => match.league.id === leagueId);
    }
    
    if (filteredMatches.length === 0) {
      return { groups: [], hasMatches: false };
    }
    
    const groups: Record<number, any> = {};
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
    
    const groupsArray = Object.values(groups);
    
    groupsArray.sort((a: any, b: any) => {
      const aIndex = priorityLeagueIds.indexOf(a.leagueId);
      const bIndex = priorityLeagueIds.indexOf(b.leagueId);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      if (aIndex !== -1) {
        return -1;
      }
      
      if (bIndex !== -1) {
        return 1;
      }
      
      return a.leagueName.localeCompare(b.leagueName);
    });
    
    return { groups: groupsArray, hasMatches: groupsArray.length > 0 };
  }, [matches, liveMatches, selectedCompetition, hasInitialData, initialGroupedMatches]);

  if (isLoading && !hasInitialData) return <LoadingSpinner>Loading matches...</LoadingSpinner>;
  if (isError && !hasInitialData) return <LoadingSpinner>Error loading matches</LoadingSpinner>;

  if (selectedCompetition && !filteredAndGroupedMatches.hasMatches) {
    return (
      <NoMatchesMessage>
        No matches available
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