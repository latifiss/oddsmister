'use client'

import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import RedCard from './redCard';
import Channel from './channel';

const Component = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px 0;
  width: 100%;

  @media only screen and (max-width: 576px) { 
        padding: 12px 0;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        padding: 12px 0;
    }
`

const Content = styled.div`
    display: grid;
    grid-template-columns: 1.1fr 0.8fr 1.1fr;
    gap: 4px;
    width: 100%;

    @media only screen and (max-width: 576px) { 
        display: grid;
        grid-template-columns: 1.1fr 86px 1.1fr;
        gap: 12px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        display: grid;
        grid-template-columns: 1.1fr 86px 1.1fr;
        gap: 12px;
    }
`

const Left = styled.div`
    display: grid;
    grid-template-columns: 1fr 30px;
    align-items: flex-end;
    width: 100%;
    gap: 4px;

    @media only screen and (max-width: 576px) { 
        display: grid;
        grid-template-columns: 1fr 26px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        display: grid;
        grid-template-columns: 1fr 26px;
    }
`

const LeftTeamInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    gap: 4px;
`

const RightTeamInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    gap: 4px;
`

const Right = styled.div`
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: flex-start;
    width: 100%;
    gap: 4px;

    @media only screen and (max-width: 576px) { 
        display: grid;
        grid-template-columns: 26px 1fr ;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        display: grid;
        grid-template-columns: 26px 1fr ;
    }
`

const Mid = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`

const Badge = styled(Image)`
    width: 24px;
    height: 24px;
    object-fit: contain;
`

const BadgeInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

const Team = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.heavyMetal};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  margin-top: 4px;

  @media only screen and (max-width: 576px) { 
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
    }
`;

const MidAlt = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const MidLive = styled.div`
  display: grid;
  grid-template-columns: 30px 60px 30px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @media only screen and (max-width: 576px) { 
        display: grid;
        grid-template-columns: 24px 38px 24px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        display: grid;
        grid-template-columns: 24px 38px 24px;
    }
`

const MidGround = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`

const HomeScoreBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--spf-milano-red);
`

const HomeScoreBoxEnded = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--spf-tuatara);
`

const AwayScoreBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--spf-milano-red);
`

const AwayScoreBoxEnded = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--spf-tuatara);
`

const ScoreText = styled.p`
  font-size: 16px;
  font-weight: 600;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  margin-top: 4px;
`;

const TimeLive = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
  color: var(--spf-milano-red);
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  margin-top: 4px;
`;

const TimeLiveEnded = styled.p<{ $isActive: boolean }>`
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.tuatara : theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  margin-top: 4px;
`;

const Time = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.heavyMetal};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;

  @media only screen and (max-width: 576px) { 
        font-size: 15px;
        font-weight: 500;
        line-height: 16px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        font-size: 15px;
        font-weight: 500;
        line-height: 16px;
    }
`;

type MatchStatus = 'live' | 'ended' | 'not_started' | 'cancelled' | 'postponed' | 'finished';

interface WidgetProps {
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
  channelName?: string | string[];
  minute?: number; 
}

const ScoreItem = ({ homeTeam, awayTeam, homeImage, awayImage, time, homeScore, awayScore, homeRedCard = 0, awayRedCard = 0, status, isActive, channelName, minute }: WidgetProps) => {
    if (status === 'live') {
    return (
      <Component>
        <Content>
          <Left>
            <LeftTeamInner>
              <RedCard count={homeRedCard} />
              <Team>{homeTeam}</Team>
            </LeftTeamInner>
            <BadgeInner>
              <Badge src={homeImage} width={18} height={18} alt='badge' />
            </BadgeInner>
          </Left>
          <MidAlt>
            <MidLive>
              <HomeScoreBox>
                <ScoreText>{homeScore}</ScoreText>
              </HomeScoreBox>
              <MidGround>
                <TimeLive>{minute || 0}'</TimeLive>
              </MidGround>
              <AwayScoreBox>
                <ScoreText>{awayScore}</ScoreText>
              </AwayScoreBox>
            </MidLive>
          </MidAlt>
          <Right>
            <BadgeInner>
              <Badge src={awayImage} width={18} height={18} alt='badge' />
            </BadgeInner>
            <RightTeamInner>
              <Team>{awayTeam}</Team>
              <RedCard count={awayRedCard} />
            </RightTeamInner>
          </Right>
        </Content>
        <Channel channels={channelName} />
      </Component>
    )
  }
  if (status === 'ended' || status === 'finished') {
    return (
      <Component>
        <Content>
          <Left>
            <LeftTeamInner>
              <RedCard count={homeRedCard} />
              <Team>{homeTeam}</Team>
            </LeftTeamInner>
            <BadgeInner>
              <Badge src={homeImage} width={18} height={18} alt='badge' />
            </BadgeInner>
          </Left>
          <MidAlt>
            <MidLive>
              <HomeScoreBoxEnded>
                <ScoreText>{homeScore}</ScoreText>
              </HomeScoreBoxEnded>
              <MidGround>
                <TimeLiveEnded $isActive={isActive}>FT</TimeLiveEnded>
              </MidGround>
              <AwayScoreBoxEnded>
                <ScoreText>{awayScore}</ScoreText>
              </AwayScoreBoxEnded>
            </MidLive>
          </MidAlt>
          <Right>
            <BadgeInner>
              <Badge src={awayImage} width={18} height={18} alt='badge' />
            </BadgeInner>
            <RightTeamInner>
              <Team>{awayTeam}</Team>
              <RedCard count={awayRedCard} />
            </RightTeamInner>
          </Right>
        </Content>
      </Component>
    )
  }
  if (status === 'cancelled') {
    return (
      <Component>
        <Content>
          <Left>
            <LeftTeamInner>
              <RedCard count={homeRedCard} />
              <Team>{homeTeam}</Team>
            </LeftTeamInner>
            <BadgeInner>
              <Badge src={homeImage} width={18} height={18} alt='badge' />
            </BadgeInner>
          </Left>
          <Mid>
            <Time>Cancelled</Time>
          </Mid>
          <Right>
            <BadgeInner>
              <Badge src={awayImage} width={18} height={18} alt='badge' />
            </BadgeInner>
            <RightTeamInner>
              <Team>{awayTeam}</Team>
              <RedCard count={awayRedCard} />
            </RightTeamInner>
          </Right>
        </Content>
      </Component>
    )
  }
  if (status === 'postponed') {
    return (
      <Component>
        <Content>
          <Left>
            <LeftTeamInner>
              <RedCard count={homeRedCard} />
              <Team>{homeTeam}</Team>
            </LeftTeamInner>
            <BadgeInner>
              <Badge src={homeImage} width={18} height={18} alt='badge' />
            </BadgeInner>
          </Left>
          <Mid>
            <Time>Postponed</Time>
          </Mid>
          <Right>
            <BadgeInner>
              <Badge src={awayImage} width={18} height={18} alt='badge' />
            </BadgeInner>
            <RightTeamInner>
              <Team>{awayTeam}</Team>
              <RedCard count={awayRedCard} />
            </RightTeamInner>
          </Right>
        </Content>
      </Component>
    )
  }
  return (
    <Component>
      <Content>
        <Left>
          <LeftTeamInner>
            <RedCard count={homeRedCard} />
            <Team>{homeTeam}</Team>
          </LeftTeamInner>
          <BadgeInner>
            <Badge src={homeImage} width={18} height={18} alt='badge' />
          </BadgeInner>
        </Left>
        <Mid>
          <Time>{time}</Time>
        </Mid>
        <Right>
          <BadgeInner>
            <Badge src={awayImage} width={18} height={18} alt='badge' />
          </BadgeInner>
          <RightTeamInner>
            <Team>{awayTeam}</Team>
            <RedCard count={awayRedCard} />
          </RightTeamInner>
        </Right>
      </Content>
      <Channel channels={channelName} />
    </Component>
  )
}

export default ScoreItem