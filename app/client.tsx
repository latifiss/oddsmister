'use client';

import Feed from '@/components/feed';
import PredictionFeed from '@/components/predictionFeed';
import Tab from '@/components/tab';
import DaySelector from '@/components/daySelector';
import React, { useState, useEffect, useMemo } from 'react';
import { useMatches, useLiveMatches } from '@/hooks/useFootballData';
import { usePathname, useRouter } from 'next/navigation';
import styled, { ThemeContext } from 'styled-components';
import Image from 'next/image';
import { useContext } from 'react';

interface Match {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number };
    venue: { name: string; city: string };
    referee: string | null;
  };
  teams: {
    home: { name: string; logo: string; redCard?: number };
    away: { name: string; logo: string; redCard?: number };
  };
  goals: { home: number | null; away: number | null };
  league: { id: number; name: string; logo: string; country: string; season: number; round: string };
}

interface GroupedMatch {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  country: string;
  matches: Match[];
}

interface LivescoreClientProps {
  initialMatches?: Match[];
  initialGroupedMatches?: GroupedMatch[];
  initialPredictionsMap?: Record<number, unknown>;
  initialSelectedDate: string;
  initialSelectedCompetition: string | null;
}

interface CachedPrediction {
  fixtureId: number;
  predictions: unknown;
}

const STATIC_LEAGUES = [
  { id: 39, name: 'Premier League', imageName: 'premier-league' },
  { id: 140, name: 'La Liga', imageName: 'laliga' },
  { id: 78, name: 'Bundesliga', imageName: 'bundesliga' },
  { id: 135, name: 'Serie A', imageName: 'serie-a' },
  { id: 61, name: 'Ligue 1', imageName: 'ligue-1' },
  { id: 2, name: 'UEFA Champions League', imageName: 'uefa-champions-league' },
  { id: 3, name: 'UEFA Europa League', imageName: 'uefa-europa-league' },
  { id: 848, name: 'UEFA Europa Conference League', imageName: 'uefa-europa-conference-league' },
];

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding: 16px 16px 100px 16px;
    box-sizing: border-box;

    @media only screen and (max-width: 576px) { 
        padding: 16px 16px 80px 16px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        padding: 20px 20px 90px 20px;
    }
`

const DesktopGrid = styled.div`
    display: grid;
    grid-template-columns: 280px 1fr 350px;
    gap: 24px;
    width: 100%;
    max-width: 100%;
    margin-top: 0px;
    box-sizing: border-box;
    align-items: start;

    @media only screen and (max-width: 1200px) {
        grid-template-columns: 260px 1fr 320px;
        gap: 20px;
    }

    @media only screen and (max-width: 1024px) {
        grid-template-columns: 240px 1fr 300px;
        gap: 16px;
    }
`

const Sidebar = styled.div`
    position: sticky;
    top: 20px;
    align-self: start;
    height: fit-content;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 12px;
    padding: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.fade};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 4px;
    }
`

const VerticalTabList = styled.div`
    display: flex;
    flex-direction: column;
`

const VerticalTabComponent = styled.div<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.dust : theme.colors.background};
`

const VerticalTabImage = styled.div`
    position: relative;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const VerticalTabText = styled.span<{ $isActive: boolean }>`
    font-size: 14px;
    font-weight: ${({ $isActive }) => $isActive ? '600' : '500'};
    color: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.white : theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const FeedColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
`

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
`

const PredictionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 12px;
    position: sticky;
    top: 20px;
    align-self: start;
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

const DesktopView = styled.div`
    display: block;
    width: 100%;
    height: 100%;
`

const MobileView = styled.div`
    display: none;
    width: 100%;

    @media only screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        position: relative;
    }
`

const TabContent = styled.div`
    flex: 1;
    width: 100%;
    padding-bottom: 80px;
`

const BottomTabs = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 20px;
    z-index: 100;
`

const SwitchContainer = styled.div`
    position: relative;
    display: flex;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 50px;
    padding: 4px;
    width: fit-content;
    margin: 0 auto;
`

const SwitchBackground = styled.div<{ $activeTab: 'matches' | 'predictions' }>`
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: calc(50% - 4px);
    background: ${({ theme }) => theme.colors.fade};
    border: 1px solid ${({ theme }) => theme.colors.fade};
    border-radius: 46px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(${({ $activeTab }) => $activeTab === 'matches' ? '0%' : '100%'});
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const TabButton = styled.button<{ $active: boolean }>`
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 10px 24px;
    border-radius: 46px;
    transition: all 0.3s ease;
    font-family: inherit;
    outline: none;
    font-size: 14px;
    font-weight: ${({ $active }) => $active ? '700' : '500'};
    color: ${({ $active, theme }) => 
        $active ? theme.colors.text : theme.colors.grayText};
    min-width: 120px;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`

const TabLabel = styled.span`
    font-size: 14px;
    font-weight: inherit;
`

const MobileTabRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    flex-wrap: nowrap;
    margin-bottom: 16px;
    padding: 0 4px;

    &::-webkit-scrollbar {
        display: none;
    }

    scrollbar-width: none;
    -ms-overflow-style: none;
`

const FeedContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
`

const DesktopTab = ({ label, isActive, href, imageName }: { 
    label: string; 
    isActive: boolean; 
    href: string; 
    imageName: string;
}) => {
    const themeContext = useContext(ThemeContext);
    const themeMode = themeContext && typeof themeContext === 'object' && 'mode' in themeContext
        ? (themeContext as { mode: string }).mode
        : (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light');

    const imagePath = themeMode === 'dark' 
        ? `/assets/comp/dark/${imageName}.png`
        : `/assets/comp/light/${imageName}.png`;

    return (
        <a href={href} style={{ textDecoration: 'none' }}>
            <VerticalTabComponent $isActive={isActive}>
                <VerticalTabImage>
                    <Image 
                        src={imagePath}
                        alt={label}
                        width={24}
                        height={24}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={() => {
                            console.error(`Failed to load image: ${imagePath}`);
                        }}
                    />
                </VerticalTabImage>
                <VerticalTabText $isActive={isActive}>{label}</VerticalTabText>
            </VerticalTabComponent>
        </a>
    );
};

const MobileTab = ({ label, isActive, href, imageName, onClick }: { 
    label: string; 
    isActive: boolean; 
    href: string; 
    imageName: string;
    onClick: () => void;
}) => {
    const themeContext = useContext(ThemeContext);
    const themeMode = themeContext && typeof themeContext === 'object' && 'mode' in themeContext
        ? (themeContext as { mode: string }).mode
        : (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light');

    const imagePath = themeMode === 'dark' 
        ? `/assets/comp/dark/${imageName}.png`
        : `/assets/comp/light/${imageName}.png`;

    return (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
            <Tab
                label={label}
                isActive={isActive}
                href={href}
                TabImage={imagePath}
            />
        </div>
    );
};

const LivescoreClient = ({ 
  initialMatches = [],
  initialGroupedMatches = [],
  initialPredictionsMap = {},
  initialSelectedDate,
  initialSelectedCompetition
}: LivescoreClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'matches' | 'predictions'>('matches');
  const [isDesktop, setIsDesktop] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(initialSelectedDate));
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(initialSelectedCompetition);
  const dateStr = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);
  const { matches, isLoading: matchesLoading, isError: matchesError } = useMatches(dateStr);
  const { liveMatches, isLoading: liveMatchesLoading, isError: liveMatchesError } = useLiveMatches();

  const sortedTabs = useMemo(() => {
    return STATIC_LEAGUES.map(league => ({
      id: league.id,
      label: league.name,
      href: '#',
      imageName: league.imageName,
    }));
  }, []);

  const selectedLeagueId = useMemo(() => {
    if (!selectedCompetition) return null;
    const league = STATIC_LEAGUES.find(l => l.name === selectedCompetition);
    return league?.id || null;
  }, [selectedCompetition]);

  const resolvedMatches = useMemo(() => {
    const liveData = Array.isArray(liveMatches) ? liveMatches : [];
    const scheduledData = Array.isArray(matches) ? matches : [];
    const combinedMatches = [...liveData, ...scheduledData];

    if (combinedMatches.length === 0) {
      return initialMatches;
    }

    return Array.from(new Map(combinedMatches.map(match => [match.fixture.id, match])).values());
  }, [initialMatches, liveMatches, matches]);

  const resolvedGroupedMatches = useMemo(() => {
    if (resolvedMatches.length === 0) {
      return initialGroupedMatches;
    }

    const groups: Record<number, GroupedMatch> = {};
    resolvedMatches.forEach((match) => {
      const leagueId = match.league.id;
      if (!groups[leagueId]) {
        groups[leagueId] = {
          leagueId,
          leagueName: match.league.name,
          leagueLogo: match.league.logo,
          country: match.league.country || '',
          matches: [],
        };
      }
      groups[leagueId].matches.push(match);
    });

    return Object.values(groups).sort((a, b) => {
      const aIndex = STATIC_LEAGUES.findIndex((league) => league.id === a.leagueId);
      const bIndex = STATIC_LEAGUES.findIndex((league) => league.id === b.leagueId);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.leagueName.localeCompare(b.leagueName);
    });
  }, [initialGroupedMatches, resolvedMatches]);

  const filteredMatches = useMemo(() => {
    if (!selectedLeagueId) return resolvedMatches;
    return resolvedMatches.filter(match => match.league.id === selectedLeagueId);
  }, [resolvedMatches, selectedLeagueId]);

  const filteredGroupedMatches = useMemo(() => {
    if (!selectedLeagueId) return resolvedGroupedMatches;
    return resolvedGroupedMatches.filter(group => group.leagueId === selectedLeagueId);
  }, [resolvedGroupedMatches, selectedLeagueId]);

  useEffect(() => {
    const handleThemeChange = () => {
      setThemeKey(prev => prev + 1);
    };
    
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleDayChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedCompetition(null);
    const params = new URLSearchParams();
    params.set('date', date.toISOString().split('T')[0]);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCompetitionSelect = (competition: string) => {
    setSelectedCompetition(competition);
  };

  const predictionsArray = Object.values(initialPredictionsMap ?? {}).filter(
    (prediction): prediction is CachedPrediction =>
      Boolean(prediction) &&
      typeof prediction === 'object' &&
      prediction !== null &&
      'fixtureId' in prediction &&
      'predictions' in prediction
  );
  const isFeedLoading = (matchesLoading || liveMatchesLoading) && filteredGroupedMatches.length === 0;
  const isFeedError = Boolean(matchesError || liveMatchesError) && filteredGroupedMatches.length === 0;
  const isPredictionsLoading = (matchesLoading || liveMatchesLoading) && filteredMatches.length === 0;

  return (
    <Wrapper key={themeKey}>
      {isDesktop && (
        <DesktopView>
          <DesktopGrid>
            <Sidebar>
              <VerticalTabList>
                {sortedTabs.map((tab) => (
                  <div key={tab.id} onClick={() => handleCompetitionSelect(tab.label)}>
                    <DesktopTab
                      label={tab.label}
                      isActive={selectedCompetition === tab.label}
                      href="#"
                      imageName={tab.imageName}
                    />
                  </div>
                ))}
              </VerticalTabList>
            </Sidebar>

            <FeedColumn>
              <DaySelector onDayChange={handleDayChange} selectedDate={selectedDate} />
              <Feed 
                groupedMatches={filteredGroupedMatches}
                isLoading={isFeedLoading}
                isError={isFeedError}
              />
            </FeedColumn>

            <RightColumn>
              <PredictionsContainer>
                <Title>Predictions</Title>
                <PredictionFeed 
                  initialPredictions={predictionsArray}
                  limit={5}
                  matches={filteredMatches}
                  isLoading={isPredictionsLoading}
                  isError={false}
                />
              </PredictionsContainer>
            </RightColumn>
          </DesktopGrid>
        </DesktopView>
      )}

      {!isDesktop && (
        <MobileView>
          <TabContent>
            {activeTab === 'matches' && (
              <FeedContainer>
                <MobileTabRow>
                  {sortedTabs.map((tab) => (
                    <MobileTab
                      key={tab.id}
                      label={tab.label}
                      isActive={selectedCompetition === tab.label}
                      href="#"
                      imageName={tab.imageName}
                      onClick={() => handleCompetitionSelect(tab.label)}
                    />
                  ))}
                </MobileTabRow>
                <DaySelector onDayChange={handleDayChange} selectedDate={selectedDate} />
                <Feed 
                  groupedMatches={filteredGroupedMatches}
                  isLoading={isFeedLoading}
                  isError={isFeedError}
                />
              </FeedContainer>
            )}
            {activeTab === 'predictions' && (
              <PredictionsContainer>
                <Title>Predictions</Title>
                <PredictionFeed 
                  initialPredictions={predictionsArray}
                  limit={5}
                  matches={filteredMatches}
                  isLoading={isPredictionsLoading}
                  isError={false}
                />
              </PredictionsContainer>
            )}
          </TabContent>

          <BottomTabs>
            <SwitchContainer>
              <SwitchBackground $activeTab={activeTab} />
              <TabButton 
                $active={activeTab === 'matches'} 
                onClick={() => setActiveTab('matches')}
              >
                <TabLabel>Matches</TabLabel>
              </TabButton>
              <TabButton 
                $active={activeTab === 'predictions'} 
                onClick={() => setActiveTab('predictions')}
              >
                <TabLabel>Predictions</TabLabel>
              </TabButton>
            </SwitchContainer>
          </BottomTabs>
        </MobileView>
      )}
    </Wrapper>
  )
}

export default LivescoreClient;