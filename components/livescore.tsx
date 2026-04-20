// components/LiveScoreBoard.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: ${({ theme }) => theme.colors?.background || '#fff'};
  border: 2px solid ${({ theme }) => theme.colors?.border || '#e0e0e0'};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
`;

const TeamColumn = styled.div`
  flex: 1;
  text-align: center;
`;

const TeamLogo = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 12px;
`;

const TeamName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || '#333'};
`;

const ScoreColumn = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#333'};
  min-width: 100px;
  text-align: center;
`;

const StatusContainer = styled.div`
  text-align: center;
  margin-top: 16px;
`;

const LiveBadge = styled.div`
  display: inline-block;
  background: #ff4444;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }
`;

const HalfTimeBadge = styled.div`
  display: inline-block;
  background: #ffa500;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const FinishedBadge = styled.div`
  display: inline-block;
  background: #666;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const NotStartedBadge = styled.div`
  display: inline-block;
  background: #2196f3;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const MinuteDisplay = styled.div`
  font-size: 14px;
  color: #ff4444;
  margin-top: 8px;
  font-weight: 600;
`;

const InjuryTime = styled.span`
  font-size: 12px;
  color: #ff8888;
  margin-left: 4px;
`;

const ConnectionStatus = styled.div<{ $status: string }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 16px;
  background: ${({ $status }) => 
    $status === 'connected' ? '#4caf50' : 
    $status === 'connecting' ? '#ff9800' : '#f44336'
  };
  color: white;
`;

interface LiveScore {
  fixtureId: number;
  status: string;
  minute: number;
  homeScore: number | null;
  awayScore: number | null;
}

export default function LiveScoreBoard({ fixtureId }: { fixtureId: number }) {
  const [liveScore, setLiveScore] = useState<LiveScore | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [localMinute, setLocalMinute] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start/stop local timer based on match status
  useEffect(() => {
    if (!liveScore) return;

    const isLive = liveScore.status === '1H' || liveScore.status === '2H';
    const isHalftime = liveScore.status === 'HT';
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (isLive) {
      // Start local timer that increments every minute
      // Sync with API minute on each update
      setLocalMinute(liveScore.minute);
      lastUpdateRef.current = liveScore.minute;
      
      timerRef.current = setInterval(() => {
        setLocalMinute(prev => {
          // Don't go beyond 90+ minutes
          if (prev >= 90) {
            // Check for injury time (90+)
            if (prev < 99) {
              return prev + 0.5; // Increment by 0.5 for injury time
            }
            return prev;
          }
          return prev + 0.5; // Increment by 0.5 minute every 30 seconds
        });
      }, 30000); // Update every 30 seconds
      
    } else if (isHalftime) {
      setLocalMinute(45);
    } else {
      setLocalMinute(liveScore.minute);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [liveScore?.status, liveScore?.minute]);

  // Sync with API updates
  useEffect(() => {
    if (liveScore && (liveScore.status === '1H' || liveScore.status === '2H')) {
      // When API updates, sync the local minute
      if (Math.abs(liveScore.minute - lastUpdateRef.current) > 1) {
        setLocalMinute(liveScore.minute);
        lastUpdateRef.current = liveScore.minute;
      }
    }
  }, [liveScore]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isMounted = true;
    
    const connect = () => {
      if (!isMounted) return;
      
      console.log('Connecting to live scores for fixture:', fixtureId);
      
      // Tell server to start tracking
      fetch(`/api/live-scores?fixtureId=${fixtureId}`).catch(console.error);
      
      // Open SSE connection
      eventSource = new EventSource(`/api/live-scores/stream?fixtureId=${fixtureId}`);
      
      eventSource.onopen = () => {
        if (isMounted) {
          console.log('SSE connection opened');
          setConnectionStatus('connected');
        }
      };
      
      eventSource.onmessage = (event) => {
        if (isMounted) {
          try {
            const data = JSON.parse(event.data);
            console.log('Received update from API:', data);
            setLiveScore(data);
          } catch (error) {
            console.error('Failed to parse SSE data:', error);
          }
        }
      };
      
      eventSource.onerror = () => {
        if (isMounted) {
          console.error('SSE connection error');
          setConnectionStatus('error');
          eventSource?.close();
          
          reconnectTimeout = setTimeout(() => {
            if (isMounted) {
              setConnectionStatus('connecting');
              connect();
            }
          }, 5000);
        }
      };
    };
    
    connect();
    
    return () => {
      isMounted = false;
      if (eventSource) eventSource.close();
      clearTimeout(reconnectTimeout);
    };
  }, [fixtureId]);

  const formatMinute = (minute: number): string => {
    if (minute >= 90) {
      const injuryTime = minute - 90;
      if (injuryTime > 0) {
        return `90+${Math.floor(injuryTime)}'`;
      }
      return `90'`;
    }
    return `${Math.floor(minute)}'`;
  };

  const getStatusDisplay = () => {
    if (!liveScore) {
      return <NotStartedBadge>Loading...</NotStartedBadge>;
    }
    
    // Check for finished matches FIRST
    const finishedStatuses = ['FT', 'AET', 'PEN', 'FT_PEN'];
    if (finishedStatuses.includes(liveScore.status)) {
      return <FinishedBadge>Full Time</FinishedBadge>;
    }
    
    // Check for halftime
    if (liveScore.status === 'HT') {
      return <HalfTimeBadge>Half Time</HalfTimeBadge>;
    }
    
    // Check for live matches
    if (liveScore.status === '1H' || liveScore.status === '2H') {
      const displayMinute = localMinute > 0 ? localMinute : liveScore.minute;
      return (
        <>
          <LiveBadge>⚡ LIVE</LiveBadge>
          <MinuteDisplay>
            {formatMinute(displayMinute)}
          </MinuteDisplay>
        </>
      );
    }
    
    // Check for not started
    if (liveScore.status === 'NS') {
      return <NotStartedBadge>Not Started</NotStartedBadge>;
    }
    
    return <NotStartedBadge>{liveScore.status}</NotStartedBadge>;
  };

  if (!fixtureId) {
    return <Container>No fixture ID provided</Container>;
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ConnectionStatus $status={connectionStatus}>
          {connectionStatus === 'connected' ? '● Live' : 
           connectionStatus === 'connecting' ? '○ Connecting...' : '⚠️ Disconnected'}
        </ConnectionStatus>
      </div>
      
      <ScoreRow>
        <TeamColumn>
          <TeamName>Home</TeamName>
        </TeamColumn>
        
        <ScoreColumn>
          {liveScore?.homeScore !== undefined && liveScore?.homeScore !== null ? liveScore.homeScore : '-'} - {liveScore?.awayScore !== undefined && liveScore?.awayScore !== null ? liveScore.awayScore : '-'}
        </ScoreColumn>
        
        <TeamColumn>
          <TeamName>Away</TeamName>
        </TeamColumn>
      </ScoreRow>
      
      <StatusContainer>
        {getStatusDisplay()}
      </StatusContainer>
      
      {connectionStatus === 'connecting' && (
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
          Establishing connection...
        </div>
      )}
    </Container>
  );
}