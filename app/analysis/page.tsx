'use client'

import Analysis from '@/components/analysis';
import Feed from '@/components/feed';
import OddScoreItem from '@/components/oddScoreItem';
import Widget from '@/components/oddScoreItem';
import ScoreItem from '@/components/scoreItem';
import Image from 'next/image';
import React, { useState } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styled from 'styled-components';
import Link from 'next/link';
import ScoreBoard from '@/components/scoreBoard';
import { matches, Match } from '@/data/matches';
import OddsDetailScreen from '@/components/oddsDetailScreen';
import PredictionFeed from '@/components/predictionFeed';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    padding: 16px 16px 100px 16px;
    box-sizing: border-box;

    @media only screen and (max-width: 576px) { 
        padding: 16px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        padding: 20px;
    }
`

const MainGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 24px;
    width: 100%;
    max-width: 100%;
    margin-top: 16px;
    box-sizing: border-box;

    @media only screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
`

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const ScoreContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 2px 0px 12px 0px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 12px;
    margin-bottom: 16px;
`

const PredictionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 12px;
`

const Title = styled.span`
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
    font-family: inherit;
    text-decoration: none;
    text-align: left;
    padding-left: 4px;
`

const BreadcrumbContainer = styled.nav`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    gap: 8px;
    margin-bottom: 12px;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
`

const Crumb = styled.span<{ clickable?: boolean }>`
    color: #6d747b;
    font-size: 14px;
    font-weight: ${props => (props.clickable ? '500' : '400')};
    font-family: inherit;
    cursor: ${props => (props.clickable ? 'pointer' : 'default')};
    text-decoration: none;
    white-space: nowrap;

    @media only screen and (max-width: 576px) { 
        font-size: 14px;
    }
`

const BreadLink = styled(Link)`
    text-decoration: none;
`

const IconContainer = styled.div<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background-color: ${({ theme }) => theme.colors.border};
    border: 1px solid ${({ $isActive, theme }) =>
        $isActive ? theme.colors.border : 'transparent'};
    border-radius: 50%;
`

const Icon = styled(IoChevronForward)`
    color: ${({ theme }) => theme.colors.grayText};
    width: 13px;
    height: 13px;
`

const HeadBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    padding: 12px 0px;
    gap: 8px;
`

const LabelTitle = styled.p`
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.heavyMetal};
    font-family: inherit;
    text-decoration: none;
    white-space: nowrap;
`

const LabelDate = styled.p`
    font-size: 16px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.colors.grayText};
    font-family: inherit;
    text-decoration: none;
    white-space: nowrap;
`

const LabelCompIcon = styled(Image)`
    width: 20px;
    height: 20px;
`

const LabelCompBlock = styled.p`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    gap: 8px;
`

const LabelComp = styled.p`
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.colors.grayText};
    font-family: inherit;
    text-decoration: none;
    white-space: nowrap;
`

const TwoColumnGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;

    @media only screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
`

const DesktopView = styled.div`
    display: block;
    width: 100%;

    @media only screen and (max-width: 768px) {
        display: none;
    }
`

const MobileView = styled.div`
    display: none;
    width: 100%;

    @media only screen and (max-width: 768px) {
        display: block;
    }
`

const TabContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    width: 100%;
`

const Tab = styled.button<{ $active: boolean }>`
    padding: 10px 16px;
    background: none;
    border: none;
    font-size: 14px;
    font-weight: ${({ $active }) => $active ? '700' : '500'};
    color: ${({ $active, theme }) => $active ? theme.colors.hot : theme.colors.grayText};
    cursor: pointer;
    border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.hot : 'transparent'};
    transition: all 0.2s ease;
    font-family: inherit;
    outline: none;

    &:hover {
        color: ${({ theme }) => theme.colors.hot};
    }
`

const TabContent = styled.div`
    width: 100%;
    padding: 8px 0;
`

interface BreadcrumbProps {
    isActive: boolean
}

export const Breadcrumb = ({ isActive }: BreadcrumbProps) => {
    return (
        <BreadcrumbContainer>
            <BreadLink href="/livescore" passHref>
                <Crumb clickable>Livescore</Crumb>
            </BreadLink>
            <IconContainer $isActive={isActive}>
                <Icon />
            </IconContainer>

            <BreadLink href="/competition" passHref>
                <Crumb clickable>Premier League</Crumb>
            </BreadLink>
            <IconContainer $isActive={isActive}>
                <Icon />
            </IconContainer>

            <Crumb>Arsenal vs Nottingham Forest</Crumb>
        </BreadcrumbContainer>
    )
}

const Page = () => {
    const isActive = true;
    const [activeTab, setActiveTab] = useState<'analysis' | 'odds'>('analysis');

    return (
        <Wrapper>
            <Breadcrumb isActive={isActive} />
            
            <HeadBlock>
                <LabelTitle>Arsenal vs Nottingham Forest</LabelTitle>
                <LabelDate>Saturday, September 13, 2025, 2:00 p.m</LabelDate>
                <LabelComp>Ligue 2 2025-2026, Matchday 5</LabelComp>
                <LabelCompBlock>
                    <LabelCompIcon src='/icons/venue.svg' alt='icon' width={20} height={20} />
                    <LabelComp>Cardiff City Stadium</LabelComp>
                </LabelCompBlock>
                <LabelCompBlock>
                    <LabelCompIcon src='/icons/referee.svg' alt='icon' width={20} height={20} />
                    <LabelComp>John Smith</LabelComp>
                </LabelCompBlock>
            </HeadBlock>

            

            <MainGrid>
                <LeftColumn>
                    <ScoreContent>
                {[matches[0]].map((match) => (
                    <ScoreBoard
                        key={match.id}
                        homeTeam={match.homeTeam.name}
                        awayTeam={match.awayTeam.name}
                        homeImage={match.homeTeam.badge}
                        awayImage={match.awayTeam.badge}
                        date={match.date}
                        time={match.time}
                        homeScore={match.homeTeam.score?.toString()}
                        awayScore={match.awayTeam.score?.toString()}
                        homeRedCard={match.homeTeam.redCards}
                        awayRedCard={match.awayTeam.redCards}
                        status={match.status}
                        isActive={true}
                        minute={match.minute}
                        isSuperboostAvailable={match.isSuperboostAvailable}
                    />
                ))}
            </ScoreContent>
                    <DesktopView>
                        <TwoColumnGrid>
                            <Analysis isActive={isActive} />
                            <OddsDetailScreen />
                        </TwoColumnGrid>
                    </DesktopView>

                    <MobileView>
                        <TabContainer>
                            <Tab $active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
                                Match Analysis
                            </Tab>
                            <Tab $active={activeTab === 'odds'} onClick={() => setActiveTab('odds')}>
                                Odds & Betting
                            </Tab>
                        </TabContainer>
                        <TabContent>
                            {activeTab === 'analysis' && <Analysis isActive={isActive} />}
                            {activeTab === 'odds' && <OddsDetailScreen />}
                        </TabContent>
                    </MobileView>
                </LeftColumn>

                <RightColumn>
                    <PredictionsContainer>
                        <Title>Predictions</Title>
                        <PredictionFeed />
                    </PredictionsContainer>
                </RightColumn>
            </MainGrid>
        </Wrapper>
    )
}

export default Page