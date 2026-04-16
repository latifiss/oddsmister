'use client'

import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

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
    grid-template-columns: 1.1fr 70px 1.1fr;
    gap: 12px;
    width: 100%;

    @media only screen and (max-width: 576px) { 
        display: grid;
        grid-template-columns: 1.1fr 56px 1.1fr;
        gap: 12px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        display: grid;
        grid-template-columns: 1.1fr 56px 1.1fr;
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

const MidAlt = styled.div<{ result: 'W' | 'L' | 'D' }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    border-radius: 2px;
    background-color: ${({ result }) => {
      if (result === 'W') return '#00995c';
      if (result === 'L') return 'rgba(214, 30, 0, 1)';
      return '#8a949c';
    }};
`

const MidLive = styled.div`
  display: grid;
  grid-template-columns: 30px 10px 30px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @media only screen and (max-width: 576px) { 
        display: grid;
        grid-template-columns: 24px 8px 24px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        display: grid;
        grid-template-columns: 24px 8px 24px;
    }
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

const MidGround = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`

const HomeScoreBoxEnded = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
`

const AwayScoreBoxEnded = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
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

interface WidgetProps {
  homeTeam: string;
  awayTeam: string;
  homeImage: string;
  awayImage: string;
  homeScore?: string;
  awayScore?: string;
  result: 'W' | 'L' | 'D';
}

const FormScoreItem = ({ homeTeam, awayTeam, homeImage, awayImage, homeScore, awayScore, result }: WidgetProps) => {
    
  return (
      <Component>
        <Content>
          <Left>
            <LeftTeamInner>
              <Team>{homeTeam}</Team>
            </LeftTeamInner>
            <BadgeInner>
              <Badge src={homeImage} width={18} height={18} alt='badge' />
            </BadgeInner>
          </Left>
          <MidAlt result={result}>
            <MidLive>
              <HomeScoreBoxEnded>
                <ScoreText>{homeScore}</ScoreText>
              </HomeScoreBoxEnded>
              <MidGround>
                <ScoreText>-</ScoreText>
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
            </RightTeamInner>
          </Right>
        </Content>
      </Component>
  )
}

export default FormScoreItem
