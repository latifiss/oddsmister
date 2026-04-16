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
import CorrectScoreHeatmap from './charts/correctScoreHeatmap';
import { scoreData } from '@/data/scoreProb';
import GoalLineProbability from './charts/goalLine';

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

const Inner = styled.div`
  display: grid;
  grid-template-columns: 1fr 45px 45px 45px;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
`;

const Block = styled.div`
  display: grid;
  grid-template-columns: 1fr 15px 45px 15px 1fr;
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
`

const AwayTeamBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
    width: 100%;
`

const HomeTeamText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: left;
  margin-top: 2px;
`;

const AwayTeamText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: right;
  margin-top: 2px;
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

type MatchStatus = 'live' | 'ended' | 'not_started' | 'cancelled' | 'postponed' | 'finished' | 'halftime';

interface ScoreProps {
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
}

const PredictionScoreItem = ({ 
  homeTeam, 
  awayTeam, 
  homeImage, 
  awayImage, 
  date,
  time, 
  homeScore, 
  awayScore, 
  homeRedCard = 0, 
  awayRedCard = 0, 
  status, 
  isActive, 
  minute,
  isSuperboostAvailable = false
}: ScoreProps) => {
  
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
      <Odd>{(Math.random() * 2 + 1).toFixed(2)}</Odd>
      <Odd>{(Math.random() * 2 + 2).toFixed(2)}</Odd>
      <Odd>{(Math.random() * 2 + 1.5).toFixed(2)}</Odd>
    </InnerAlt>
  );

  if (status === 'live') {
    return (
      <Component>
        {renderHeader()}
        <Content>
          <Bottom>
            <Block>
              <HomeTeamBlock>
                <Badge src={homeImage} width={18} height={18} alt='badge' />
                <HomeTeamText>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <Score>{homeScore || '0'}</Score>
              <Mid>
                <ScoreTimerVertical minute={minute || 55} />
              </Mid>
              <Score>{awayScore || '0'}</Score>
              <AwayTeamBlock>
                <AwayTeamText>{awayTeam}</AwayTeamText>
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
                    <IQContainer>
                    <CorrectScoreHeatmap 
  data={scoreData}
  homeTeam="Arsenal"
  awayTeam="Chelsea"
  homeBadge="https://img.sofascore.com/api/v1/team/42/image"
  awayBadge="https://img.sofascore.com/api/v1/team/43/image"
/>
                </IQContainer>
          </Bottom>
        </Content>
      </Component>
    );
  }

  if (status === 'not_started') {
    return (
      <Component>
        {renderHeader()}
        <Content>
          <Bottom>
            <Block>
              <HomeTeamBlock>
                <Badge src={homeImage} width={18} height={18} alt='badge' />
                <HomeTeamText>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <Score>-</Score>
              <Mid>
                <Date>{date} • {time}</Date>
              </Mid>
              <Score>-</Score>
              <AwayTeamBlock>
                <AwayTeamText>{awayTeam}</AwayTeamText>
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
                </Bottom>
                <IQContainer>
                    <WinProbabilityMeter 
                      homeProbability={58}
                      awayProbability={25}
                      drawProbability={17}
                      homeTeam="Arsenal"
                      awayTeam="Chelsea"
                      homeColor="#ef0107"
                      awayColor="#034694"
                      homeBadge="https://img.sofascore.com/api/v1/team/42/image"
                      awayBadge="https://img.sofascore.com/api/v1/team/43/image"
                            />
                </IQContainer>
        </Content>
      </Component>
    );
  }

  if (status === 'halftime') {
    return (
      <Component>
        <Content>
          <Bottom>
            <Block>
              <HomeTeamBlock>
                <Badge src={homeImage} width={18} height={18} alt='badge' />
                <HomeTeamText>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <ScoreHalf>{homeScore || '0'}</ScoreHalf>
              <Mid>
                <ScoreTimerVertical minute={45} isHalftime={true} />
              </Mid>
              <ScoreHalf>{awayScore || '0'}</ScoreHalf>
              <AwayTeamBlock>
                <AwayTeamText>{awayTeam}</AwayTeamText>
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
          </Bottom>
        </Content>
      </Component>
    );
  }

  if (status === 'ended' || status === 'finished') {
    return (
      <Component>
        <Content>
          <Bottom>
            <Block>
              <HomeTeamBlock>
                <Badge src={homeImage} width={18} height={18} alt='badge' />
                <HomeTeamText>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <ScoreEnd>{homeScore || '0'}</ScoreEnd>
              <Mid>
                <ScoreTimerVertical minute={90} isFulltime={true} />
              </Mid>
              <ScoreEnd>{awayScore || '0'}</ScoreEnd>
              <AwayTeamBlock>
                <AwayTeamText>{awayTeam}</AwayTeamText>
                <Badge src={awayImage} width={18} height={18} alt='badge' />
              </AwayTeamBlock>
            </Block>
            <ScoreInfo>
              <InnerAlt>
                <OddSign>1</OddSign>
                <OddSign>X</OddSign>
                <OddSign>2</OddSign>
              </InnerAlt>
              <InnerAlt>
                <Odd>{homeScore ? (parseFloat(homeScore) * 0.5).toFixed(2) : '0.00'}</Odd>
                <Odd>-</Odd>
                <Odd>{awayScore ? (parseFloat(awayScore) * 0.8).toFixed(2) : '0.00'}</Odd>
              </InnerAlt>
            </ScoreInfo>
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
                <HomeTeamText>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <Score>-</Score>
              <Mid>
                <Date>Cancelled</Date>
              </Mid>
              <Score>-</Score>
              <AwayTeamBlock>
                <AwayTeamText>{awayTeam}</AwayTeamText>
                <Badge src={awayImage} width={18} height={18} alt='badge' />
              </AwayTeamBlock>
            </Block>
            <ScoreInfo>
              <InnerAlt>
                <OddSign>1</OddSign>
                <OddSign>X</OddSign>
                <OddSign>2</OddSign>
              </InnerAlt>
              <InnerAlt>
                <Odd>-</Odd>
                <Odd>-</Odd>
                <Odd>-</Odd>
              </InnerAlt>
            </ScoreInfo>
                </Bottom>
                <IQContainer>
                    <GoalLineProbability 
        overProbability={45}
        underProbability={55}
      />
                </IQContainer>
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
                <HomeTeamText>{homeTeam}</HomeTeamText>
              </HomeTeamBlock>
              <Score>-</Score>
              <Mid>
                <Date>Postponed</Date>
              </Mid>
              <Score>-</Score>
              <AwayTeamBlock>
                <AwayTeamText>{awayTeam}</AwayTeamText>
                <Badge src={awayImage} width={18} height={18} alt='badge' />
              </AwayTeamBlock>
            </Block>
            <ScoreInfo>
              <InnerAlt>
                <OddSign>1</OddSign>
                <OddSign>X</OddSign>
                <OddSign>2</OddSign>
              </InnerAlt>
              <InnerAlt>
                <Odd>-</Odd>
                <Odd>-</Odd>
                <Odd>-</Odd>
              </InnerAlt>
            </ScoreInfo>
          </Bottom>
        </Content>
      </Component>
    );
  }

  return null;
};

export default PredictionScoreItem;