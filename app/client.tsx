'use client';

import Feed from '@/components/feed';
import PredictionFeed from '@/components/predictionFeed';
import Tab from '@/components/tab';
import DaySelector from '@/components/daySelector';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  initialMatches: Match[];
  initialGroupedMatches: GroupedMatch[];
  initialPredictionsMap: Record<number, unknown>;
  initialSelectedDate: string;
  initialSelectedCompetition: string | null;
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

const LoadingOverlay = styled.div`
    position: relative;
    width: 100%;
    
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;

const LoadingSpinner = styled.div`
    text-align: center;
    padding: 20px;
    color: ${({ theme }) => theme.colors.grayText};
`;

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
                        onError={(e) => {
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
  initialMatches,
  initialGroupedMatches,
  initialPredictionsMap,
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
  
  // Progressive loading states
  const [predictionsMap, setPredictionsMap] = useState<Record<number, unknown>>(initialPredictionsMap);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(Object.keys(initialPredictionsMap).length === 0);
  const [matches, setMatches] = useState(initialMatches);
  const [groupedMatches, setGroupedMatches] = useState(initialGroupedMatches);
  const [isHydrated, setIsHydrated] = useState(false);

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

  const filteredMatches = useMemo(() => {
    if (!selectedLeagueId) return matches;
    return matches.filter(match => match.league.id === selectedLeagueId);
  }, [matches, selectedLeagueId]);

  const filteredGroupedMatches = useMemo(() => {
    if (!selectedLeagueId) return groupedMatches;
    return groupedMatches.filter(group => group.leagueId === selectedLeagueId);
  }, [groupedMatches, selectedLeagueId]);

  // Fetch predictions progressively
  useEffect(() => {
    const fetchPredictions = async () => {
      if (Object.keys(predictionsMap).length > 0 || matches.length === 0) return;
      
      setIsLoadingPredictions(true);
      
      // Get unique fixture IDs from matches (limit to first 10 for performance)
      const fixtureIds = matches.slice(0, 10).map(match => match.fixture.id);
      
      // Fetch predictions in small batches
      const batchSize = 3;
      const newPredictions: Record<number, unknown> = {};
      
      for (let i = 0; i < fixtureIds.length; i += batchSize) {
        const batch = fixtureIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (fixtureId) => {
          try {
            const response = await fetch(`/api/predictions?fixtureId=${fixtureId}`);
            const data = await response.json();
            if (data.response && data.response[0]) {
              newPredictions[fixtureId] = data.response[0];
            }
          } catch (error) {
            console.error(`Failed to fetch prediction for ${fixtureId}:`, error);
          }
        });
        
        await Promise.all(batchPromises);
        
        // Update UI progressively as each batch completes
        setPredictionsMap(prev => ({ ...prev, ...newPredictions }));
      }
      
      setIsLoadingPredictions(false);
    };
    
    fetchPredictions();
  }, [matches]);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  const handleDayChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedCompetition(null);
    // Reset predictions when changing date
    setPredictionsMap({});
    setIsLoadingPredictions(true);
    
    const params = new URLSearchParams();
    params.set('date', date.toISOString().split('T')[0]);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname]);

  const handleCompetitionSelect = useCallback((competition: string) => {
    setSelectedCompetition(competition);
  }, []);

  const predictionsArray = Object.values(predictionsMap).filter(p => p !== null);

  // Show loading state during hydration
  if (!isHydrated) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

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
                selectedDate={selectedDate} 
                selectedCompetition={selectedLeagueId ? selectedLeagueId.toString() : null}
                initialMatches={filteredMatches}
                initialGroupedMatches={filteredGroupedMatches}
              />
            </FeedColumn>

            <RightColumn>
              <PredictionsContainer>
                <Title>Predictions</Title>
                {isLoadingPredictions && predictionsArray.length === 0 ? (
                  <LoadingSpinner>Loading predictions...</LoadingSpinner>
                ) : (
                  <PredictionFeed 
                    initialPredictions={predictionsArray}
                    limit={5}
                    matches={matches}
                    isLoading={isLoadingPredictions}
                    isError={false}
                  />
                )}
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
                  selectedDate={selectedDate} 
                  selectedCompetition={selectedLeagueId ? selectedLeagueId.toString() : null}
                  initialMatches={filteredMatches}
                  initialGroupedMatches={filteredGroupedMatches}
                />
              </FeedContainer>
            )}
            {activeTab === 'predictions' && (
              <PredictionsContainer>
                <Title>Predictions</Title>
                {isLoadingPredictions && predictionsArray.length === 0 ? (
                  <LoadingSpinner>Loading predictions...</LoadingSpinner>
                ) : (
                  <PredictionFeed 
                    initialPredictions={predictionsArray}
                    limit={5}
                    matches={matches}
                    isLoading={isLoadingPredictions}
                    isError={false}
                  />
                )}
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