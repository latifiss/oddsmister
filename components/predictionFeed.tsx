'use client';

import React, { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import PredictionScoreItem from './predictionScoreItem';
import { distributeCharts } from '@/utils/chartDistributor';
import { formatTime } from '@/utils/timeFormatter';
import { PredictionFeedSkeleton } from './loadingSkeletons';

const ScoreWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.grayText};
  font-size: 14px;
`;

type MatchStatus = 'live' | 'halftime' | 'ended' | 'not_started';
type ChartType = 'winProbability' | 'goalLine' | 'dualGauge';

const getMatchStatus = (status: string): MatchStatus => {
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

const getStoredSelectedFixtures = (): { fixtureIds: number[]; chartDistribution: ChartType[] } | null => {
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

const storeSelectedFixtures = (fixtureIds: number[], chartDistribution: ChartType[]): void => {
  try {
    localStorage.setItem(SELECTED_FIXTURES_KEY, JSON.stringify(fixtureIds));
    localStorage.setItem(CHART_DISTRIBUTION_KEY, JSON.stringify(chartDistribution));
    localStorage.setItem(SELECTED_FIXTURES_DATE_KEY, getTodayDateString());
  } catch (error) {
    console.error('Failed to store fixtures:', error);
  }
};

interface Match {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number };
  };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}

interface CachedPrediction {
  fixtureId: number;
  predictions: unknown;
}

interface PredictionFeedProps {
  initialPredictions?: CachedPrediction[];
  limit?: number;
  matches?: Match[];
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
  const initialPredictionsMap = useMemo(() => {
    const predictions = new Map<number, unknown>();

    initialPredictions.forEach((item) => {
      if (item?.fixtureId) {
        predictions.set(item.fixtureId, item.predictions);
      }
    });

    return predictions;
  }, [initialPredictions]);

  const [predictionsData, setPredictionsData] = useState<Map<number, unknown>>(initialPredictionsMap);
  const [loadingPredictions, setLoadingPredictions] = useState(initialPredictionsMap.size === 0);
  const [fetched, setFetched] = useState(initialPredictionsMap.size > 0);
  
  const { selectedMatches, chartDistribution } = useMemo((): { selectedMatches: Match[]; chartDistribution: ChartType[] } => {
    if (!externalMatches || !externalMatches.length) {
      return { selectedMatches: [], chartDistribution: [] };
    }
    
    const notStartedMatches = externalMatches.filter(
      match => getMatchStatus(match.fixture.status.short) === 'not_started'
    );
    
    const stored = getStoredSelectedFixtures();
    if (stored && stored.fixtureIds.length > 0) {
      const selected = stored.fixtureIds
        .map(id => notStartedMatches.find(match => match.fixture.id === id))
        .filter(match => match !== undefined);
      
      if (selected.length === limit) {
        return { selectedMatches: selected, chartDistribution: stored.chartDistribution };
      }
    }
    
    const selected = notStartedMatches.slice(0, limit);
    const newChartDistribution = distributeCharts(selected.length);
    if (selected.length > 0) {
      storeSelectedFixtures(selected.map(match => match.fixture.id), newChartDistribution);
    }
    
    return { selectedMatches: selected, chartDistribution: newChartDistribution };
  }, [externalMatches, limit]);

  // ✅ NEW: Fetch ALL predictions from our cache endpoint at once
  useEffect(() => {
    const fetchPredictionsFromCache = async () => {
      if (!selectedMatches.length || fetched) return;
      
      setLoadingPredictions(true);
      try {
        // ✅ Call OUR cache endpoint, NOT API-Football directly
        const response = await fetch('/api/predictions/feed');
        const data = await response.json();
        
        if (data.success && data.predictions) {
          const predictions = new Map<number, unknown>();
          // The predictions come with fixture data included
          data.predictions.forEach((pred: CachedPrediction) => {
            predictions.set(pred.fixtureId, pred.predictions);
          });
          setPredictionsData(predictions);
        } else {
          console.warn('No predictions in cache:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch predictions from cache:', error);
      } finally {
        setLoadingPredictions(false);
        setFetched(true);
      }
    };
    
    fetchPredictionsFromCache();
  }, [selectedMatches, fetched]);

  if (externalLoading && !selectedMatches.length) return <PredictionFeedSkeleton items={limit} />;
  if (externalError && !selectedMatches.length) return <NoMatchesMessage data-cy="predictions-error">Error loading matches</NoMatchesMessage>;
  if (loadingPredictions && !fetched) return <PredictionFeedSkeleton items={selectedMatches.length || limit} />;
  if (!selectedMatches.length) return <NoMatchesMessage data-cy="no-predictions-available">No upcoming matches available for predictions today</NoMatchesMessage>;

  return (
    <ScoreWrapper data-cy="prediction-feed-container">
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
            status={getMatchStatus(match.fixture.status.short)}
            isActive
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