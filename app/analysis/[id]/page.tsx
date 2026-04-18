'use client'

import Analysis from '@/components/analysis';
import Feed from '@/components/feed';
import OddScoreItem from '@/components/oddScoreItem';
import Widget from '@/components/oddScoreItem';
import ScoreItem from '@/components/scoreItem';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styled from 'styled-components';
import Link from 'next/link';
import ScoreBoard from '@/components/scoreBoard';
import { matches } from '@/data/matches';
import OddsDetailScreen from '@/components/oddsDetailScreen';
import PredictionFeed from '@/components/predictionFeed';
import { useParams } from 'next/navigation';

// Match interface definition
interface Match {
  id: number;
  fixtureId?: number;
  homeTeam: {
    name: string;
    badge: string;
    score?: number;
    redCards?: number;
  };
  awayTeam: {
    name: string;
    badge: string;
    score?: number;
    redCards?: number;
  };
  date: string;
  time: string;
  status: string;
  minute?: number;
  isSuperboostAvailable?: boolean;
  competition?: string;
  competitionName?: string;
  venue?: string;
  referee?: string;
}

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

const Crumb = styled.span<{ $clickable?: boolean }>`
    color: #6d747b;
    font-size: 14px;
    font-weight: ${props => (props.$clickable ? '500' : '400')};
    font-family: inherit;
    cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
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

const LabelTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.heavyMetal};
    font-family: inherit;
    text-decoration: none;
    white-space: nowrap;
`

const LabelDate = styled.div`
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

const LabelCompBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    gap: 8px;
`

const LabelComp = styled.div`
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
    matchTitle?: string
    competition?: string
}

export const Breadcrumb = ({ isActive, matchTitle = "Match", competition = "Premier League" }: BreadcrumbProps) => {
    return (
        <BreadcrumbContainer>
            <BreadLink href="/livescore" passHref>
                <Crumb as="span" $clickable>Livescore</Crumb>
            </BreadLink>
            <IconContainer $isActive={isActive}>
                <Icon />
            </IconContainer>

            <BreadLink href="/competition" passHref>
                <Crumb as="span" $clickable>{competition}</Crumb>
            </BreadLink>
            <IconContainer $isActive={isActive}>
                <Icon />
            </IconContainer>

            <Crumb as="span">{matchTitle}</Crumb>
        </BreadcrumbContainer>
    )
}

const Page = () => {
    const params = useParams();
    const id = params?.id as string;
    const [activeTab, setActiveTab] = useState<'analysis' | 'odds'>('analysis');
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Find the match by ID from your matches data
        const foundMatch = matches.find(m => m.id.toString() === id);
        if (foundMatch) {
            setMatch(foundMatch as Match);
        }
        setLoading(false);
    }, [id]);

    if (loading) {
        return <Wrapper>Loading...</Wrapper>;
    }

    if (!match) {
        return <Wrapper>Match not found</Wrapper>;
    }

    const fixtureId = match.fixtureId || match.id;
    const matchTitle = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
    const competition = match.competition || "Premier League";

    return (
        <Wrapper>
            <Breadcrumb isActive={true} matchTitle={matchTitle} competition={competition} />
            
            <HeadBlock>
                <LabelTitle>{matchTitle}</LabelTitle>
                <LabelDate>{match.date}, {match.time}</LabelDate>
                <LabelComp>{match.competitionName || "League Match"}</LabelComp>
                <LabelCompBlock>
                    <LabelCompIcon src='/icons/venue.svg' alt='icon' width={20} height={20} />
                    <LabelComp>{match.venue || "Stadium"}</LabelComp>
                </LabelCompBlock>
                <LabelCompBlock>
                    <LabelCompIcon src='/icons/referee.svg' alt='icon' width={20} height={20} />
                    <LabelComp>{match.referee || "TBD"}</LabelComp>
                </LabelCompBlock>
            </HeadBlock>

            <MainGrid>
                <LeftColumn>
                    <ScoreContent>
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
                    </ScoreContent>
                    <DesktopView>
                        <TwoColumnGrid>
                            <Analysis isActive={true} fixtureId={fixtureId} />
                            <OddsDetailScreen fixtureId={fixtureId} />
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
                            {activeTab === 'analysis' && <Analysis isActive={true} fixtureId={fixtureId} />}
                            {activeTab === 'odds' && <OddsDetailScreen fixtureId={fixtureId} />}
                        </TabContent>
                    </MobileView>
                </LeftColumn>

                <RightColumn>
                    <PredictionsContainer>
                        <Title>Predictions</Title>
                        <PredictionFeed fixtureId={fixtureId} />
                    </PredictionsContainer>
                </RightColumn>
            </MainGrid>
        </Wrapper>
    )
}

export default Page