'use client';

import React, { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import PredictionScoreItem from './predictionScoreItem';
import { distributeCharts } from '@/utils/chartDistributor';
import { formatTime } from '@/utils/timeFormatter';

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

const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

const teamColorCache = new Map<string, string>();

const getTeamColor = (teamName: string): string => {
  if (teamColorCache.has(teamName)) {
    return teamColorCache.get(teamName)!;
  }
  
  const color = generateRandomColor();
  teamColorCache.set(teamName, color);
  return color;
};

const SELECTED_FIXTURES_KEY = 'selected_predictions_fixtures';
const SELECTED_FIXTURES_DATE_KEY = 'selected_predictions_date';
const CHART_DISTRIBUTION_KEY = 'selected_predictions_charts';

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getStoredSelectedFixtures = (): { fixtureIds: number[]; chartDistribution: string[] } | null => {
  try {
    const storedDate = localStorage.getItem(SELECTED_FIXTURES_DATE_KEY);
    const today = getTodayDateString();
    
    if (storedDate === today) {
      const storedFixtures = localStorage.getItem(SELECTED_FIXTURES_KEY);
      const storedCharts = localStorage.getItem(CHART_DISTRIBUTION_KEY);
      if (storedFixtures && storedCharts) {
        return {
          fixtureIds: JSON.parse(storedFixtures),
          chartDistribution: JSON.parse(storedCharts)
        };
      }
    }
  } catch (error) {
    console.error('Failed to read stored fixtures:', error);
  }
  return null;
};

const storeSelectedFixtures = (fixtureIds: number[], chartDistribution: string[]): void => {
  try {
    localStorage.setItem(SELECTED_FIXTURES_KEY, JSON.stringify(fixtureIds));
    localStorage.setItem(CHART_DISTRIBUTION_KEY, JSON.stringify(chartDistribution));
    localStorage.setItem(SELECTED_FIXTURES_DATE_KEY, getTodayDateString());
  } catch (error) {
    console.error('Failed to store fixtures:', error);
  }
};

interface PredictionFeedProps {
  initialPredictions?: any[];
  limit?: number;
  matches?: any[];
  isLoading?: boolean;
  isError?: boolean;
}

const PredictionFeed = ({ 
  initialPredictions = [], 
  limit = 5,
  matches: externalMatches,
  isLoading: externalLoading,
  isError: externalError
}: PredictionFeedProps) => {
  const [predictionsData, setPredictionsData] = useState<Map<number, any>>(new Map());
  const [loadingPredictions, setLoadingPredictions] = useState(initialPredictions.length === 0);
  const [fetched, setFetched] = useState(initialPredictions.length > 0);
  const [storedChartDistribution, setStoredChartDistribution] = useState<string[] | null>(null);

  const { selectedMatches, chartDistribution } = useMemo(() => {
    if (!externalMatches || !externalMatches.length) {
      return { selectedMatches: [], chartDistribution: [] };
    }
    
    const notStartedMatches = externalMatches.filter(
      match => getMatchStatus(match.fixture.status.short) === 'not_started'
    );
    
    // Check if we have stored fixtures for today
    const stored = getStoredSelectedFixtures();
    
    if (stored && stored.fixtureIds.length > 0) {
      // Use stored fixtures
      const selected = stored.fixtureIds
        .map(id => notStartedMatches.find(match => match.fixture.id === id))
        .filter(match => match !== undefined);
      
      if (selected.length === limit) {
        return { 
          selectedMatches: selected, 
          chartDistribution: stored.chartDistribution 
        };
      }
    }
    
    // If no stored fixtures or not enough matches, select new ones
    const shuffled = [...notStartedMatches];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selected = shuffled.slice(0, limit);
    const newChartDistribution = distributeCharts(selected.length);
    
    // Store the selected fixture IDs and chart distribution for today
    if (selected.length > 0) {
      storeSelectedFixtures(selected.map(match => match.fixture.id), newChartDistribution);
    }
    
    return { 
      selectedMatches: selected, 
      chartDistribution: newChartDistribution 
    };
  }, [externalMatches, limit]);

  // Use initial predictions from server if available
  useEffect(() => {
    if (initialPredictions.length > 0 && !fetched) {
      const predictions = new Map();
      initialPredictions.forEach(pred => {
        if (pred && pred.fixture?.id) {
          predictions.set(pred.fixture.id, pred);
        }
      });
      setPredictionsData(predictions);
      setFetched(true);
      setLoadingPredictions(false);
    }
  }, [initialPredictions, fetched]);

  // Fetch predictions via API (Upstash will cache them automatically)
  useEffect(() => {
    if (fetched) return;
    if (!selectedMatches.length) return;
    
    const fetchPredictions = async () => {
      setLoadingPredictions(true);
      const predictions = new Map();
      
      const fetchPromises = selectedMatches.map(async (match) => {
        try {
          const response = await fetch(`/api/predictions?fixtureId=${match.fixture.id}`);
          const data = await response.json();
          if (data.response && data.response[0]) {
            predictions.set(match.fixture.id, data.response[0]);
          }
        } catch (error) {
          console.error(`Failed to fetch prediction for ${match.fixture.id}:`, error);
        }
      });
      
      await Promise.all(fetchPromises);
      
      setPredictionsData(predictions);
      setLoadingPredictions(false);
      setFetched(true);
    };
    
    fetchPredictions();
  }, [selectedMatches, fetched]);

  if (externalLoading) {
    return <LoadingSpinner>Loading matches...</LoadingSpinner>;
  }
  
  if (externalError) {
    return <LoadingSpinner>Error loading matches</LoadingSpinner>;
  }
  
  if (loadingPredictions && !fetched) {
    return <LoadingSpinner>Loading predictions...</LoadingSpinner>;
  }
  
  if (!selectedMatches.length) {
    return <NoMatchesMessage>No upcoming matches available for predictions today</NoMatchesMessage>;
  }

  return (
    <ScoreWrapper>
      {selectedMatches.map((match, index) => {
        const prediction = predictionsData.get(match.fixture.id);
        const homeColor = getTeamColor(match.teams.home.name);
        const awayColor = getTeamColor(match.teams.away.name);
        
        return (
          <PredictionScoreItem
            key={match.fixture.id}
            fixtureId={match.fixture.id}
            homeTeam={match.teams.home.name}
            awayTeam={match.teams.away.name}
            homeImage={match.teams.home.logo}
            awayImage={match.teams.away.logo}
            date={new Date(match.fixture.date).toLocaleDateString('en-GB')}
            time={formatTime(match.fixture.date)}
            homeScore={match.goals.home?.toString()}
            awayScore={match.goals.away?.toString()}
            status={match.fixture.status.short}
            minute={match.fixture.status.elapsed}
            chartType={chartDistribution[index]}
            prediction={prediction}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        );
      })}
    </ScoreWrapper>
  );
};

export default PredictionFeed;