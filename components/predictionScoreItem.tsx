'use client'

import React from 'react';
import styled from 'styled-components';
import ConnectedTags from './connectedTags';
import Image from 'next/image';
import ScoreTimerVertical from './scoreTimerVertical';
import Superboost from './superboost';
import HotTag from './hotTag';
import BestOddTag from './bestOddTag';
import WinProbabilityMeter from './charts/winProbabilityMeter';
import GoalLineProbability from './charts/goalLine';
import DualGaugeChart from './charts/dualGuage';

const Component = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px 12px 0px;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 0 0 0;
`;

const LeftTags = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RightTags = styled.div`
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 1px;
  padding: 0px 12px;
`;

const MarkerRow = styled.div<{ $scale?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
  
  & > * {
    transform: scale(${({ $scale }) => $scale || 1});
    transform-origin: left center;
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const IQContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    margin-top: 12px;
`

const Block = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 15px 45px 15px minmax(0, 1fr);
  width: 100%;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const InnerAlt = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  align-items: center;
  justify-items: center;
  gap: 8px;
  margin-top: 8px;

  div, span, button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  color: ${({ theme }) => theme.colors.grayText};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  margin: 0;
`;

const OddSign = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  color: ${({ theme }) => theme.colors.grayText};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  margin: 0;
`;

const ScoreInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 0px;
    margin-top: 4px;
`

const HomeTeamBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 7px;
    width: 100%;
    min-width: 0;
    flex: 1;
`

const AwayTeamBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
    width: 100%;
    min-width: 0;
    flex: 1;
`

const HomeTeamText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  text-align: left;
  margin-top: 2px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AwayTeamText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  text-align: right;
  margin-top: 2px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Mid = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0px 4px;
`

const Badge = styled(Image)`
    width: 18px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
`

const Odd = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 24px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
`

const Score = styled.div`
display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 24px;
    font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.hot};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
`

const ScoreEnd = styled.div`
display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 24px;
    font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.end};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
`

const ScoreHalf = styled.div`
display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 24px;
    font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.half};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
`

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const StatusLine = styled.span`
  font-size: 10px;
  font-weight: 500;
  line-height: 12px;
  color: ${({ theme }) => theme.colors.grayText};
  font-family: inherit;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
`;

type MatchStatus = 'live' | 'ended' | 'not_started' | 'cancelled' | 'postponed' | 'finished' | 'halftime';
type ChartType = 'winProbability' | 'goalLine' | 'dualGauge';

interface ScoreProps {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  homeImage: string;
  awayImage: string;
  date: string;
  time: string;
  homeScore?: string;
  awayScore?: string;
  homeRedCard?: number;
  awayRedCard?: number;
  status: MatchStatus;
  isActive: boolean;
  minute?: number;
  isSuperboostAvailable?: boolean;
  chartType?: ChartType;
  prediction?: any;
}

const getMatchStatus = (status: string): MatchStatus => {
  if (status === '1H' || status === '2H') return 'live';
  if (status === 'HT') return 'halftime';
  if (status === 'FT') return 'ended';
  if (status === 'NS') return 'not_started';
  return 'not_started';
};

const PredictionScoreItem = ({ 
  fixtureId,
  homeTeam, 
  awayTeam, 
  homeImage, 
  awayImage, 
  date,
  time, 
  homeScore, 
  awayScore, 
  status: rawStatus, 
  minute,
  isSuperboostAvailable = false,
  chartType,
  prediction
}: ScoreProps) => {
  const status = getMatchStatus(rawStatus);
  
  const renderStatusText = (text: string) => {
    const words = text.split(' ');
    if (words.length > 1) {
      return (
        <StatusContainer>
          <StatusLine>{words[0]}</StatusLine>
          <StatusLine>{words.slice(1).join(' ')}</StatusLine>
        </StatusContainer>
      );
    }
    return <StatusLine>{text}</StatusLine>;
  };

  const getLeftTag = () => {
    const random = Math.random();
    
    if (status !== 'live' && status !== 'not_started') {
      return null;
    }
    
    if (status === 'live') {
      if (random < 0.15) {
        return <HotTag />;
      } else if (random < 0.25) {
        return <BestOddTag />;
      } else if (random < 0.35) {
        return <ConnectedTags />;
      }
      return null;
    }
    
    if (status === 'not_started') {
      if (random < 0.2) {
        return <ConnectedTags />;
      } else if (random < 0.3) {
        return <BestOddTag />;
      }
      return null;
    }
    
    return null;
  };

  const getRightTag = () => {
    if (status !== 'live' && status !== 'not_started') {
      return null;
    }
    
    if (isSuperboostAvailable && status === 'live') {
      const random = Math.random();
      if (random < 0.3) {
        return <Superboost />;
      }
    }
    
    if (isSuperboostAvailable && status === 'not_started') {
      const random = Math.random();
      if (random < 0.15) {
        return <Superboost />;
      }
    }
    
    return null;
  };

  const leftTag = getLeftTag();
  const rightTag = getRightTag();

  const renderHeader = () => {
    if (!leftTag && !rightTag) return null;
    
    return (
      <Head>
        <LeftTags>
          {leftTag && (
            <MarkerRow $scale={0.8}>
              {leftTag}
            </MarkerRow>
          )}
        </LeftTags>
        <RightTags>
          {rightTag && (
            <MarkerRow $scale={0.8}>
              {rightTag}
            </MarkerRow>
          )}
        </RightTags>
      </Head>
    );
  };

  const renderOddsRow = () => (
    <InnerAlt>
      <Odd>{prediction?.comparison?.odds?.[0] || (Math.random() * 2 + 1).toFixed(2)}</Odd>
      <Odd>{prediction?.comparison?.odds?.[1] || (Math.random() * 2 + 2).toFixed(2)}</Odd>
      <Odd>{prediction?.comparison?.odds?.[2] || (Math.random() * 2 + 1.5).toFixed(2)}</Odd>
    </InnerAlt>
  );

  const renderChart = () => {
    if (!chartType) return null;

    switch (chartType) {
      case 'winProbability':
        return (
          <IQContainer>
            <WinProbabilityMeter 
              homeProbability={prediction?.predictions?.win_percentage || 45}
              awayProbability={prediction?.predictions?.lose_percentage || 35}
              drawProbability={prediction?.predictions?.draw_percentage || 20}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              homeColor="#ef0107"
              awayColor="#034694"
              homeBadge={homeImage}
              awayBadge={awayImage}
            />
          </IQContainer>
        );
      
      case 'goalLine':
        return (
          <IQContainer>
            <GoalLineProbability 
              overProbability={prediction?.predictions?.goals?.over_percentage || 45}
              underProbability={prediction?.predictions?.goals?.under_percentage || 55}
            />
          </IQContainer>
        );
      
      case 'dualGauge':
        return (
          <IQContainer>
            <DualGaugeChart 
              overProbability={prediction?.predictions?.goals?.over_percentage || 45}
              underProbability={prediction?.predictions?.goals?.under_percentage || 55}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              title="Over / Under Goals Probability"
            />
          </IQContainer>
        );
      
      default:
        return null;
    }
  };

  if (status === 'not_started') {
    return (
      <Component>
        {renderHeader()}
        <Content>
          <Bottom>
            <Block>
              <HomeTeamBlock>
                <Badge src={homeImage} width={18} height={18} alt='badge' />
                <HomeTeamText title={homeTeam}>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <Score> </Score>
              <Mid>
                <StatusContainer>
                  <StatusLine>{date}</StatusLine>
                  <StatusLine>{time}</StatusLine>
                </StatusContainer>
              </Mid>
              <Score> </Score>
              <AwayTeamBlock>
                <AwayTeamText title={awayTeam}>{awayTeam}</AwayTeamText>
                <Badge src={awayImage} width={18} height={18} alt='badge' />
              </AwayTeamBlock>
            </Block>
            <ScoreInfo>
              <InnerAlt>
                <OddSign>1</OddSign>
                <OddSign>X</OddSign>
                <OddSign>2</OddSign>
              </InnerAlt>
              {renderOddsRow()}
            </ScoreInfo>
            {renderChart()}
          </Bottom>
        </Content>
      </Component>
    );
  }

  if (status === 'cancelled') {
    return (
      <Component>
        <Content>
          <Bottom>
            <Block>
              <HomeTeamBlock>
                <Badge src={homeImage} width={18} height={18} alt='badge' />
                <HomeTeamText title={homeTeam}>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <Score> </Score>
              <Mid>
                {renderStatusText('Cancelled')}
              </Mid>
              <Score> </Score>
              <AwayTeamBlock>
                <AwayTeamText title={awayTeam}>{awayTeam}</AwayTeamText>
                <Badge src={awayImage} width={18} height={18} alt='badge' />
              </AwayTeamBlock>
            </Block>
          </Bottom>
        </Content>
      </Component>
    );
  }

  if (status === 'postponed') {
    return (
      <Component>
        <Content>
          <Bottom>
            <Block>
              <HomeTeamBlock>
                <Badge src={homeImage} width={18} height={18} alt='badge' />
                <HomeTeamText title={homeTeam}>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <Score> </Score>
              <Mid>
                {renderStatusText('Postponed')}
              </Mid>
              <Score> </Score>
              <AwayTeamBlock>
                <AwayTeamText title={awayTeam}>{awayTeam}</AwayTeamText>
                <Badge src={awayImage} width={18} height={18} alt='badge' />
              </AwayTeamBlock>
            </Block>
          </Bottom>
        </Content>
      </Component>
    );
  }

  return null;
};

export default PredictionScoreItem;