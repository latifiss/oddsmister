'use client'

import Feed from '@/components/feed';
import PredictionFeed from '@/components/predictionFeed';
import Tab from '@/components/tab';
import DaySelector from '@/components/daySelector';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styled, { ThemeContext } from 'styled-components';
import Image from 'next/image';
import { useContext } from 'react';

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
`;

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
`;

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

const tabs = [
    { label: 'Premier League', href: '/premier-league', imageName: 'premier-league' },
    { label: 'La Liga', href: '/laliga', imageName: 'laliga' },
    { label: 'Bundesliga', href: '/bundesliga', imageName: 'bundesliga' },
    { label: 'Serie A', href: '/serie-a', imageName: 'serie-a' },
    { label: 'Ligue 1', href: '/ligue-1', imageName: 'ligue-1' },
    { label: 'MLS', href: '/mls', imageName: 'mls' },
    { label: 'Uefa Champions League', href: '/uefa-champions-league', imageName: 'uefa-champions-league' },
    { label: 'World Cup', href: '/world-cup', imageName: 'worldcup' },
    { label: 'Europa League', href: '/uefa-europa-league', imageName: 'uefa-europa-league' },
    { label: 'Conference League', href: '/uefa-europa-conference-league', imageName: 'uefa-europa-conference-league' },
];

const DesktopTab = ({ label, isActive, href, imageName }: { 
    label: string; 
    isActive: boolean; 
    href: string; 
    imageName: string;
}) => {
    const themeContext = useContext(ThemeContext);
    const [themeMode, setThemeMode] = useState('light');
    
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'light';
        setThemeMode(storedTheme);
        
        if (themeContext && themeContext.mode) {
            setThemeMode(themeContext.mode);
        }
    }, [themeContext]);
    
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

const Page = () => {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<'matches' | 'predictions'>('matches');
    const [isDesktop, setIsDesktop] = useState(false);
    const [themeKey, setThemeKey] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);

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
    };

    const handleCompetitionSelect = (competition: string) => {
        setSelectedCompetition(competition);
    };

    return (
        <Wrapper key={themeKey}>
            {isDesktop && (
                <DesktopView>
                    <DesktopGrid>
                        <Sidebar>
                            <VerticalTabList>
                                {tabs.map((tab) => (
                                    <div key={tab.label} onClick={() => handleCompetitionSelect(tab.label)}>
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
                            <Feed selectedDate={selectedDate} selectedCompetition={selectedCompetition} />
                        </FeedColumn>

                        <RightColumn>
                            <PredictionsContainer>
                                <Title>Predictions</Title>
                                <PredictionFeed />
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
                                    {tabs.map((tab) => (
                                        <div key={tab.label} onClick={() => handleCompetitionSelect(tab.label)}>
                                            <Tab
                                                label={tab.label}
                                                isActive={selectedCompetition === tab.label}
                                                href="#"
                                                TabImage={`/assets/competitions/${tab.imageName}.png`}
                                            />
                                        </div>
                                    ))}
                                </MobileTabRow>
                                <DaySelector onDayChange={handleDayChange} selectedDate={selectedDate} />
                                <Feed selectedDate={selectedDate} selectedCompetition={selectedCompetition} />
                            </FeedContainer>
                        )}
                        {activeTab === 'predictions' && (
                            <PredictionsContainer>
                                <Title>Predictions</Title>
                                <PredictionFeed />
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

export default Page