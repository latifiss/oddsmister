'use client';

import React, { useMemo, useEffect, useState, useCallback } from 'react';
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
  color: ${({ theme }) => theme.colors.grayText};
`;

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.grayText};
  font-size: 14px;
`;

const SkeletonItem = styled.div`
  width: 100%;
  padding: 16px;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const PredictionSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <SkeletonItem key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ width: '60px', height: '20px', background: '#e0e0e0', borderRadius: '4px' }} />
            <div style={{ width: '40px', height: '20px', background: '#e0e0e0', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', background: '#e0e0e0', borderRadius: '50%' }} />
              <div style={{ width: '80px', height: '16px', background: '#e0e0e0', borderRadius: '4px' }} />
            </div>
            <div style={{ width: '40px', height: '24px', background: '#e0e0e0', borderRadius: '4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '80px', height: '16px', background: '#e0e0e0', borderRadius: '4px' }} />
              <div style={{ width: '32px', height: '32px', background: '#e0e0e0', borderRadius: '50%' }} />
            </div>
          </div>
        </SkeletonItem>
      ))}
    </>
  );
};

const CacheBadge = styled.div<{ $isCached: boolean }>`
  position: absolute;
  top: -8px;
  right: 8px;
  background: ${({ $isCached, theme }) => $isCached ? '#4caf50' : theme.colors.primary};
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  z-index: 1;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  if (typeof window === 'undefined') return null;
  
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
  if (typeof window === 'undefined') return;
  
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
  showCacheBadge?: boolean;
}

const PredictionFeed = ({ 
  initialPredictions = [], 
  limit = 5,
  matches: externalMatches,
  isLoading: externalLoading,
  isError: externalError,
  showCacheBadge = false
}: PredictionFeedProps) => {
  const [predictionsData, setPredictionsData] = useState<Map<number, any>>(new Map());
  const [loadingPredictions, setLoadingPredictions] = useState(initialPredictions.length === 0 && !externalLoading);
  const [fetched, setFetched] = useState(initialPredictions.length > 0);
  const [isClient, setIsClient] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { selectedMatches, chartDistribution } = useMemo(() => {
    if (!externalMatches || !externalMatches.length) {
      return { selectedMatches: [], chartDistribution: [] };
    }
    
    const notStartedMatches = externalMatches.filter(
      match => getMatchStatus(match.fixture.status.short) === 'not_started'
    );
    
    if (notStartedMatches.length === 0) {
      return { selectedMatches: [], chartDistribution: [] };
    }
    
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
    
    const selected = shuffled.slice(0, Math.min(limit, notStartedMatches.length));
    const newChartDistribution = distributeCharts(selected.length);
    
    // Store the selected fixture IDs and chart distribution for today
    if (selected.length > 0 && typeof window !== 'undefined') {
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
      setIsFromCache(true);
    }
  }, [initialPredictions, fetched]);

  // Fetch predictions using batch API (optimized for Upstash Redis)
  const fetchPredictionsBatch = useCallback(async () => {
    if (!selectedMatches.length) return;
    
    setLoadingPredictions(true);
    setFetchError(null);
    
    const fixtureIds = selectedMatches.map(match => match.fixture.id);
    
    try {
      // Use batch endpoint which reads from Upstash Redis
      const response = await fetch(`/api/predictions/batch?fixtureIds=${fixtureIds.join(',')}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const predictions = new Map();
      if (data.predictions) {
        Object.entries(data.predictions).forEach(([fixtureId, prediction]) => {
          if (prediction) {
            predictions.set(parseInt(fixtureId), prediction);
          }
        });
      }
      
      setPredictionsData(predictions);
      setIsFromCache(data.fromCache === true);
      
      // Log cache status for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        if (data.fromCache) {
          console.log('📦 Predictions served from Upstash Redis cache');
        } else {
          console.log('🔄 Predictions fetched from API (cache miss)');
        }
      }
    } catch (error) {
      console.error('Failed to fetch predictions batch:', error);
      setFetchError(error instanceof Error ? error.message : 'Failed to load predictions');
      
      // Fallback: Try individual requests if batch fails
      try {
        const predictions = new Map();
        for (const match of selectedMatches) {
          const individualResponse = await fetch(`/api/predictions?fixtureId=${match.fixture.id}`);
          const individualData = await individualResponse.json();
          if (individualData.response && individualData.response[0]) {
            predictions.set(match.fixture.id, individualData.response[0]);
          }
          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setPredictionsData(predictions);
        setIsFromCache(false);
        setFetchError(null);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoadingPredictions(false);
      setFetched(true);
    }
  }, [selectedMatches]);

  // Trigger batch fetch when matches are selected
  useEffect(() => {
    if (fetched || !selectedMatches.length || !isClient) return;
    
    // Small delay to allow component to settle
    const timer = setTimeout(() => {
      fetchPredictionsBatch();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [selectedMatches, fetched, isClient, fetchPredictionsBatch]);

  // Retry function for error state
  const handleRetry = useCallback(() => {
    setFetched(false);
    setFetchError(null);
    setPredictionsData(new Map());
  }, []);

  // Show skeleton loading state
  if (!isClient || (loadingPredictions && !fetched && initialPredictions.length === 0 && !fetchError)) {
    return <PredictionSkeleton />;
  }
  
  if (externalLoading && !fetched) {
    return <PredictionSkeleton />;
  }
  
  if (externalError) {
    return (
      <NoMatchesMessage>
        Error loading matches. Please refresh the page.
      </NoMatchesMessage>
    );
  }
  
  if (fetchError) {
    return (
      <NoMatchesMessage>
        <div>Failed to load predictions</div>
        <button 
          onClick={handleRetry}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </NoMatchesMessage>
    );
  }
  
  if (!selectedMatches.length) {
    return (
      <NoMatchesMessage>
        No upcoming matches available for predictions today
      </NoMatchesMessage>
    );
  }

  return (
    <ScoreWrapper>
      {selectedMatches.map((match, index) => {
        const prediction = predictionsData.get(match.fixture.id);
        const homeColor = getTeamColor(match.teams.home.name);
        const awayColor = getTeamColor(match.teams.away.name);
        
        // Check if this specific prediction came from cache (if we have it in predictionsData)
        const isCached = isFromCache && prediction !== undefined;
        
        return (
          <div key={match.fixture.id} style={{ position: 'relative', width: '100%' }}>
            {showCacheBadge && isCached && !loadingPredictions && (
              <CacheBadge $isCached={true}>
                ⚡ Cached
              </CacheBadge>
            )}
            <PredictionScoreItem
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
          </div>
        );
      })}
    </ScoreWrapper>
  );
};

export default PredictionFeed;