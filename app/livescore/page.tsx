'use client'

import Feed from '@/components/feed';
import OddScoreItem from '@/components/oddScoreItem';
import Widget from '@/components/oddScoreItem';
import ScoreItem from '@/components/scoreItem';
import { matches } from '@/data/matches';
import Image from 'next/image';
import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 16px 100px 120px 16px;

    @media only screen and (max-width: 576px) { 
        padding: 16px 0 120px 16px;
  }

  @media only screen and (min-width: 577px) and (max-width: 768px) { 
        padding: 20px 20px 100px 20px;
  }
`

const Inner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0px;
    gap: 16px;
`

const ContentInside = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0px;
    gap: 8px;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 0px 0px 0px;
    margin-bottom: -8px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    gap: 8px;
`

const HeaderText = styled.p`
    text-align: left;
    font-size: 20px;
    line-height: 1.2;
    font-weight: 800;
    font-family: inherit;
    text-transform: uppercase;
    text-decoration: none;
    color: ${({ theme }) => theme?.colors?.text};
    margin-top: 4px;
`;

const IconContainer = styled.div<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.deep};
    border: 1px solid ${({ $isActive, theme }) =>
    $isActive ? theme.colors.border : 'transparent'};
    border-radius: 50%;
`

const Icon = styled(IoChevronForward)`
    color: ${({ theme }) => theme.colors.grayText};
    width: 16px;
    height: 16px;
`

const Badge = styled(Image)`
    width: 30px;
    height: 30px;
    object-fit: contain;
`

interface LiveScoreProps {
    isActive: boolean
}

const page = ({isActive}: LiveScoreProps) => {
  return (
      <Wrapper>
          <Inner>
          <Header>
                <HeaderLeft>
                    <Badge src='/assets/competitions/premier-league.png' width={30} height={30} alt='section_badge' />
                    <HeaderText>Premier League</HeaderText>
                </HeaderLeft>
                <IconContainer $isActive={isActive}>
                    <Icon />
                </IconContainer>
            </Header>
          <ContentInside>
          {matches.map((match) => (
  <ScoreItem
    key={match.homeTeam + match.awayTeam}
    homeTeam={match.homeTeam}
    awayTeam={match.awayTeam}
    homeImage={match.homeImage}
    awayImage={match.awayImage}
    date={match.date}
    time={match.time}
    homeScore={match.homeScore}
    awayScore={match.awayScore}
    status={match.status}
    homeRedCard={match.homeRedCard} 
    awayRedCard={match.awayRedCard} 
  />
))}
          </ContentInside>
          <Header>
                <HeaderLeft>
                    <Badge src='/assets/competitions/laliga.png' width={30} height={30} alt='section_badge' />
                    <HeaderText>Premier League</HeaderText>
                </HeaderLeft>
                <IconContainer $isActive={isActive}>
                    <Icon />
                </IconContainer>
            </Header>
          <ContentInside>
          {matches.map((match) => (
  <ScoreItem
    key={match.homeTeam + match.awayTeam}
    homeTeam={match.homeTeam}
    awayTeam={match.awayTeam}
    homeImage={match.homeImage}
    awayImage={match.awayImage}
    date={match.date}
    time={match.time}
    homeScore={match.homeScore}
    awayScore={match.awayScore}
    status={match.status}
    homeRedCard={parseInt(match.homeRedCard) || 0}
    awayRedCard={parseInt(match.awayRedCard) || 0}
    channelName={match.channelName}
    isActive={false} 
              />
              
          ))}
                  
          </ContentInside>
          </Inner>
          <ContentInside>
              <Feed/>
          </ContentInside>
    </Wrapper>
  )
}

export default page