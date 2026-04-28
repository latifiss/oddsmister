'use client';

import React from 'react';
import styled from 'styled-components';
import ScoreBoard from './scoreBoard';
import Image from 'next/image';
import { formatTime } from '@/utils/timeFormatter';
import { FeedSkeleton } from './loadingSkeletons';

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

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.grayText};
  font-size: 14px;
`;

interface FeedProps {
  groupedMatches?: GroupedMatch[];
  isLoading?: boolean;
  isError?: boolean;
}

interface Match {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number };
  };
  teams: {
    home: { name: string; logo: string; redCard?: number };
    away: { name: string; logo: string; redCard?: number };
  };
  goals: { home: number | null; away: number | null };
}

interface GroupedMatch {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  country: string;
  matches: Match[];
}

export default function Feed({ 
  groupedMatches = [],
  isLoading = false,
  isError = false,
}: FeedProps) {
  if (isLoading && groupedMatches.length === 0) return <FeedSkeleton />;
  if (isError && groupedMatches.length === 0) return <NoMatchesMessage data-cy="feed-error">Error loading matches</NoMatchesMessage>;
  if (groupedMatches.length === 0) return <NoMatchesMessage data-cy="no-matches-date">No matches available for this date</NoMatchesMessage>;

  return (
    <Container data-cy="matches-feed-container">
      {groupedMatches.map((group) => (
        <LeagueSection key={group.leagueId} data-cy={`league-section-${group.leagueId}`}>
          <LeagueHeader data-cy="league-header">
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
          <MatchesList data-cy="matches-list">
            {group.matches.map((match, index) => (
              <React.Fragment key={match.fixture.id}>
                <ScoreBoard
                  fixtureId={match.fixture.id}
                  homeTeam={match.teams.home.name}
                  awayTeam={match.teams.away.name}
                  homeImage={match.teams.home.logo}
                  awayImage={match.teams.away.logo}
                  date={new Date(match.fixture.date).toLocaleDateString('en-GB')}
                  time={formatTime(match.fixture.date)}
                  homeScore={match.goals.home?.toString()}
                  awayScore={match.goals.away?.toString()}
                  homeRedCard={match.teams.home.redCard}
                  awayRedCard={match.teams.away.redCard}
                  status={match.fixture.status.short}
                  minute={match.fixture.status.elapsed}
                  isSuperboostAvailable={(match.fixture.id % 10) < 3}
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