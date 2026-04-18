'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { IoChevronForward } from 'react-icons/io5';
import OddsDetailScreen from '@/components/oddsDetailScreen';
import PredictionFeed from '@/components/predictionFeed';
import ScoreBoard from '@/components/scoreBoard';

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
    grid-template-columns: 1fr;
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

const StructuredData = ({ match }: { match: any }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.teams.home.name} vs ${match.teams.away.name}`,
    startDate: match.fixture.date,
    location: {
      '@type': 'StadiumOrArena',
      name: match.fixture.venue?.name || 'TBD',
      address: {
        '@type': 'PostalAddress',
        addressLocality: match.fixture.venue?.city || '',
      },
    },
    homeTeam: {
      '@type': 'SportsTeam',
      name: match.teams.home.name,
      logo: match.teams.home.logo,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: match.teams.away.name,
      logo: match.teams.away.logo,
    },
    league: {
      '@type': 'SportsOrganization',
      name: match.league.name,
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const Breadcrumb = ({ match, league }: { match: any; league: any }) => {
    const isActive = true;
    return (
        <BreadcrumbContainer>
            <BreadLink href="/" passHref>
                <Crumb as="span" $clickable>Home</Crumb>
            </BreadLink>
            <IconContainer $isActive={isActive}>
                <Icon />
            </IconContainer>

            <BreadLink href={`/competition/${league?.id}`} passHref>
                <Crumb as="span" $clickable>{league?.name || 'Competition'}</Crumb>
            </BreadLink>
            <IconContainer $isActive={isActive}>
                <Icon />
            </IconContainer>

            <Crumb as="span">{match?.teams?.home?.name} vs {match?.teams?.away?.name}</Crumb>
        </BreadcrumbContainer>
    );
};

interface MatchDetailClientProps {
  fixtureId: number;
  initialMatch: any;
  initialPredictions: any;
  initialOdds: any;
  initialMatches?: any[];
  matchesLoading?: boolean;
  matchesError?: boolean;
}

export default function MatchDetailClient({ 
  fixtureId, 
  initialMatch, 
  initialPredictions, 
  initialOdds,
  initialMatches = [],
  matchesLoading = false,
  matchesError = false
}: MatchDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'odds'>('odds');
  
  const match = initialMatch;
  const fixture = match.fixture;
  const teams = match.teams;
  const goals = match.goals;
  const league = match.league;
  
  return (
    <>
      <StructuredData match={match} />
      <Wrapper>
        <Breadcrumb match={match} league={league} />
        
        <HeadBlock>
          <LabelTitle>{teams.home.name} vs {teams.away.name}</LabelTitle>
          <LabelDate>{new Date(fixture.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, {new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</LabelDate>
          <LabelComp>{league.name} {league.season || ''}, {league.round || ''}</LabelComp>
          <LabelCompBlock>
            <LabelCompIcon src='/icons/venue.svg' alt='icon' width={20} height={20} />
            <LabelComp>{fixture.venue?.name || 'TBD'}, {fixture.venue?.city || ''}</LabelComp>
          </LabelCompBlock>
          <LabelCompBlock>
            <LabelCompIcon src='/icons/referee.svg' alt='icon' width={20} height={20} />
            <LabelComp>{fixture.referee || 'TBD'}</LabelComp>
          </LabelCompBlock>
        </HeadBlock>

        <MainGrid>
          <LeftColumn>
            <ScoreContent>
              <ScoreBoard
                fixtureId={fixture.id}
                homeTeam={teams.home.name}
                awayTeam={teams.away.name}
                homeImage={teams.home.logo}
                awayImage={teams.away.logo}
                date={new Date(fixture.date).toLocaleDateString()}
                time={new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                homeScore={goals.home?.toString()}
                awayScore={goals.away?.toString()}
                homeRedCard={teams.home.redCard}
                awayRedCard={teams.away.redCard}
                status={fixture.status.short}
                isActive={true}
                minute={fixture.status.elapsed}
                isSuperboostAvailable={false}
              />
            </ScoreContent>
            
            <DesktopView>
              <TwoColumnGrid>
                <OddsDetailScreen fixtureId={fixture.id} initialOddsData={initialOdds} />
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
                {activeTab === 'analysis' && <div>Analysis Component Placeholder</div>}
                {activeTab === 'odds' && <OddsDetailScreen fixtureId={fixture.id} initialOddsData={initialOdds} />}
              </TabContent>
            </MobileView>
          </LeftColumn>

          <RightColumn>
            <PredictionsContainer>
              <Title>Predictions Picks</Title>
              <PredictionFeed 
                initialPredictions={initialPredictions ? [initialPredictions] : []} 
                limit={5}
                matches={initialMatches}
                isLoading={matchesLoading}
                isError={matchesError}
              />
            </PredictionsContainer>
          </RightColumn>
        </MainGrid>
      </Wrapper>
    </>
  );
}