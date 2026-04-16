'use client';

import { useMatches, useLiveMatches } from '@/hooks/useMatches';
import { useState } from 'react';
import styled from 'styled-components';
import ScoreBoard from './scoreBoard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

export default function Feed() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { matches, isLoading, isError } = useMatches();
  const { liveMatches } = useLiveMatches();

  if (isLoading) return <LoadingSpinner>Loading matches...</LoadingSpinner>;
  if (isError) return <LoadingSpinner>Error loading matches</LoadingSpinner>;

  const allMatches = [...liveMatches, ...matches];
  const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.fixture.id, m])).values());

  return (
    <Container>
      {uniqueMatches.map((match) => (
        <ScoreBoard
          key={match.fixture.id}
          homeTeam={match.teams.home.name}
          awayTeam={match.teams.away.name}
          homeImage={match.teams.home.logo}
          awayImage={match.teams.away.logo}
          date={match.fixture.date}
          homeScore={match.goals.home}
          awayScore={match.goals.away}
          status={match.fixture.status.short}
          minute={match.fixture.status.elapsed}
          isLive={match.fixture.status.short === '1H' || match.fixture.status.short === '2H'}
        />
      ))}
    </Container>
  );
}