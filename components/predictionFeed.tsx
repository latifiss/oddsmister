'use client';

import React, { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMatches } from '@/hooks/useFootballData';
import PredictionScoreItem from './predictionScoreItem';
import { distributeCharts } from '@/utils/chartDistributor';

const ScoreWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

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

const getMatchStatus = (status: string): string => {
  if (status === '1H' || status === '2H') return 'live';
  if (status === 'HT') return 'halftime';
  if (status === 'FT') return 'ended';
  if (status === 'NS') return 'not_started';
  return 'not_started';
};

const PredictionFeed = () => {
  const { matches, isLoading, isError } = useMatches();
  const [predictionsData, setPredictionsData] = useState<Map<number, any>>(new Map());
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const selectedMatches = useMemo(() => {
    if (!matches || !matches.length) return [];
    
    const notStartedMatches = matches.filter(
      match => getMatchStatus(match.fixture.status.short) === 'not_started'
    );
    
    const shuffled = [...notStartedMatches];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 10);
  }, [matches]);

  const predictionsWithCharts = useMemo(() => {
    const chartDistribution = distributeCharts(selectedMatches.length);
    
    return selectedMatches.map((match, index) => ({
      match,
      chartType: chartDistribution[index],
      prediction: predictionsData.get(match.fixture.id)
    }));
  }, [selectedMatches, predictionsData]);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!selectedMatches.length) return;
      
      setLoadingPredictions(true);
      const predictions = new Map();
      
      for (const match of selectedMatches) {
        try {
          const response = await fetch(`/api/predictions?fixtureId=${match.fixture.id}`);
          const data = await response.json();
          if (data.response && data.response[0]) {
            predictions.set(match.fixture.id, data.response[0]);
          }
        } catch (error) {
          console.error(`Failed to fetch prediction for ${match.fixture.id}:`, error);
        }
      }
      
      setPredictionsData(predictions);
      setLoadingPredictions(false);
    };
    
    fetchPredictions();
  }, [selectedMatches]);

  if (isLoading || loadingPredictions) return <LoadingSpinner>Loading predictions...</LoadingSpinner>;
  if (isError) return <LoadingSpinner>Error loading matches</LoadingSpinner>;
  
  if (!predictionsWithCharts.length) {
    return <NoMatchesMessage>No upcoming matches available for predictions today</NoMatchesMessage>;
  }

  return (
    <ScoreWrapper>
      {predictionsWithCharts.map(({ match, chartType, prediction }) => (
        <PredictionScoreItem
          key={match.fixture.id}
          fixtureId={match.fixture.id}
          homeTeam={match.teams.home.name}
          awayTeam={match.teams.away.name}
          homeImage={match.teams.home.logo}
          awayImage={match.teams.away.logo}
          date={new Date(match.fixture.date).toLocaleDateString()}
          time={new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          homeScore={match.goals.home?.toString()}
          awayScore={match.goals.away?.toString()}
          status={match.fixture.status.short}
          minute={match.fixture.status.elapsed}
          chartType={chartType}
          prediction={prediction}
        />
      ))}
    </ScoreWrapper>
  );
}

export default PredictionFeed;