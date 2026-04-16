'use client'

import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import Image from 'next/image';
import OddsRow from './oddsRow';
import OddsRowAlt from './oddsRowAlt';
import { IoChevronForward, IoClose } from 'react-icons/io5';
import { getProviderLogo } from '@/utils/bettingProviders';
import { useBettingProvider } from '@/hooks/useBettingProvider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  max-width: 600px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  margin: 0;
`;

const CompareButtonHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayText};
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
`;

const ChevronIcon = styled(IoChevronForward)`
  font-size: 12px;
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, ${({ $isOpen }) => $isOpen ? '0.7' : '0'});
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background 0.3s ease;
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  pointer-events: ${({ $isOpen }) => $isOpen ? 'auto' : 'none'};
  
  @media only screen and (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  transform: ${({ $isOpen }) => $isOpen ? 'scale(1)' : 'scale(0.9)'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  overflow: hidden;
  
  @media only screen and (max-width: 768px) {
    border-radius: 20px 20px 0 0;
    max-height: 80vh;
    transform: translateY(${({ $isOpen }) => $isOpen ? '0%' : '100%'});
    opacity: 1;
    max-width: 100%;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.fade};
    border-radius: 4px;
    margin: 4px 0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.grayText};
  }
  
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.fade};
  
  @media only screen and (max-width: 768px) {
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  flex-shrink: 0;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayText};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  margin: 12px auto 0;
  display: none;
  
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const OddsHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  position: sticky;
  top: 0;
  z-index: 1;
  flex-shrink: 0;
`;

const OddsHeaderLabels = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  grid-column: 2;
`;

const OddsHeaderLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  min-width: 60px;
  padding: 4px 8px;
`;

const ProviderRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ProviderLogoModal = styled.div`
  position: relative;
  width: 60px;
  height: 32px;
`;

const ProviderOdds = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const OddButtonStyled = styled.button<{ $isBest?: boolean }>`
  min-width: 60px;
  height: 32px;
  border: 1px solid ${({ theme, $isBest }) => 
    $isBest ? theme.colors.border : theme.colors.border};
  border-radius: 8px;
  background: ${({ theme, $isBest }) => 
    $isBest ? 'transparent' : 'transparent'};
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme, $isBest }) => 
    $isBest ? theme.colors.text : theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0 8px;

  &:active {
    transform: translateY(0);
  }
`;

const OddsDetailScreen = () => {
  const { getLogo, currentTheme } = useBettingProvider();
  const [selectedOdds, setSelectedOdds] = useState<Map<string, boolean>>(new Map());
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    marketName: string;
    providers: Array<{
      name: string;
      logo: string;
      odds: Array<{ id: string; value: number; label?: string }>;
    }>;
    oddsLabels?: string[];
  }>({
    isOpen: false,
    marketName: '',
    providers: [],
    oddsLabels: [],
  });

  useEffect(() => {
    if (modalData.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalData.isOpen]);

  const handleOddClick = (id: string, value: number) => {
    const newSelected = new Map(selectedOdds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.set(id, true);
    }
    setSelectedOdds(newSelected);
    console.log(`Selected odd ${id}: ${value}`);
  };

  const handleCompareClick = (marketName: string, oddsLabels?: string[]) => {
    const providersData: Record<string, Array<{
      name: string;
      logo: string;
      odds: Array<{ id: string; value: number; label?: string }>;
    }>> = {
      'Match Result': [
        { name: 'Bet365', logo: getLogo('bet365'), odds: [
          { id: 'home_365', value: 2.20 },
          { id: 'draw_365', value: 3.50 },
          { id: 'away_365', value: 3.30 }
        ]},
        { name: '10Bet', logo: getLogo('10bet'), odds: [
          { id: 'home_10bet', value: 2.18 },
          { id: 'draw_10bet', value: 3.48 },
          { id: 'away_10bet', value: 3.28 }
        ]},
        { name: '1xBet', logo: getLogo('1xbet'), odds: [
          { id: 'home_1xbet', value: 2.25 },
          { id: 'draw_1xbet', value: 3.55 },
          { id: 'away_1xbet', value: 3.35 }
        ]},
        { name: '188Bet', logo: getLogo('188bet'), odds: [
          { id: 'home_188bet', value: 2.16 },
          { id: 'draw_188bet', value: 3.42 },
          { id: 'away_188bet', value: 3.22 }
        ]},
        { name: 'Betfred', logo: getLogo('betfred'), odds: [
          { id: 'home_betfred', value: 2.12 },
          { id: 'draw_betfred', value: 3.38 },
          { id: 'away_betfred', value: 3.18 }
        ]},
        { name: 'bwin', logo: getLogo('bwin'), odds: [
          { id: 'home_bwin', value: 2.14 },
          { id: 'draw_bwin', value: 3.44 },
          { id: 'away_bwin', value: 3.24 }
        ]},
        { name: 'Dafabet', logo: getLogo('dafabet'), odds: [
          { id: 'home_dafabet', value: 2.22 },
          { id: 'draw_dafabet', value: 3.52 },
          { id: 'away_dafabet', value: 3.32 }
        ]},
        { name: 'Interwetten', logo: getLogo('interwetten'), odds: [
          { id: 'home_interwetten', value: 2.10 },
          { id: 'draw_interwetten', value: 3.35 },
          { id: 'away_interwetten', value: 3.15 }
        ]},
        { name: 'Ladbrokes', logo: getLogo('ladbrokes'), odds: [
          { id: 'home_ladbrokes', value: 2.13 },
          { id: 'draw_ladbrokes', value: 3.41 },
          { id: 'away_ladbrokes', value: 3.21 }
        ]},
        { name: 'Marathonbet', logo: getLogo('marathonbet'), odds: [
          { id: 'home_marathonbet', value: 2.24 },
          { id: 'draw_marathonbet', value: 3.54 },
          { id: 'away_marathonbet', value: 3.34 }
        ]},
        { name: 'Pinnacle', logo: getLogo('pinnacle'), odds: [
          { id: 'home_pinnacle', value: 2.28 },
          { id: 'draw_pinnacle', value: 3.58 },
          { id: 'away_pinnacle', value: 3.38 }
        ]},
        { name: 'Unibet', logo: getLogo('unibet'), odds: [
          { id: 'home_unibet', value: 2.11 },
          { id: 'draw_unibet', value: 3.39 },
          { id: 'away_unibet', value: 3.19 }
        ]},
        { name: 'William Hill', logo: getLogo('william-hill'), odds: [
          { id: 'home_williamhill', value: 2.09 },
          { id: 'draw_williamhill', value: 3.37 },
          { id: 'away_williamhill', value: 3.17 }
        ]},
      ],
      'Over / Under 2.5': [
        { name: 'Bet365', logo: getLogo('bet365'), odds: [
          { id: 'over_365', value: 2.00 },
          { id: 'under_365', value: 1.90 }
        ]},
        { name: '1xBet', logo: getLogo('1xbet'), odds: [
          { id: 'over_1xbet', value: 2.05 },
          { id: 'under_1xbet', value: 1.88 }
        ]},
        { name: 'bwin', logo: getLogo('bwin'), odds: [
          { id: 'over_bwin', value: 1.98 },
          { id: 'under_bwin', value: 1.87 }
        ]},
        { name: 'Pinnacle', logo: getLogo('pinnacle'), odds: [
          { id: 'over_pinnacle', value: 2.03 },
          { id: 'under_pinnacle', value: 1.92 }
        ]},
      ]
    };

    const providers = providersData[marketName as keyof typeof providersData] || [];
    
    setModalData({
      isOpen: true,
      marketName,
      providers,
      oddsLabels: oddsLabels || ['1', 'X', '2'],
    });
  };

  const closeModal = () => {
    setModalData({ ...modalData, isOpen: false });
  };

  const matchResultOdds = [
    { id: 'home', value: 2.10, label: '1', trend: 'up' as const },
    { id: 'draw', value: 3.40, label: 'X', trend: 'stable' as const },
    { id: 'away', value: 3.20, label: '2', trend: 'down' as const },
  ];

  const overUnderOdds = [
    { id: 'over', value: 1.95, label: 'Over 2.5', trend: 'up' as const },
    { id: 'under', value: 1.85, label: 'Under 2.5', trend: 'down' as const },
  ];

  const altBettingProviders = [
    {
      provider: { 
        name: 'Bet365', 
        logo: getLogo('bet365'), 
        alt: 'Bet365' 
      },
      odds: [
        { id: 'home_365', value: 2.10, label: '1', trend: 'up' as const },
        { id: 'draw_365', value: 3.40, label: 'X', trend: 'stable' as const },
        { id: 'away_365', value: 3.20, label: '2', trend: 'down' as const },
      ]
    },
    {
      provider: { 
        name: '10Bet', 
        logo: getLogo('10bet'), 
        alt: '10Bet' 
      },
      odds: [
        { id: 'home_10bet', value: 2.08, label: '1', trend: 'up' as const },
        { id: 'draw_10bet', value: 3.38, label: 'X', trend: 'stable' as const },
        { id: 'away_10bet', value: 3.18, label: '2', trend: 'down' as const },
      ]
    },
    {
      provider: { 
        name: '1xBet', 
        logo: getLogo('1xbet'), 
        alt: '1xBet' 
      },
      odds: [
        { id: 'home_1xbet', value: 2.20, label: '1', trend: 'up' as const },
        { id: 'draw_1xbet', value: 3.50, label: 'X', trend: 'stable' as const },
        { id: 'away_1xbet', value: 3.30, label: '2', trend: 'down' as const },
      ]
    },
    {
      provider: { 
        name: 'bwin', 
        logo: getLogo('bwin'), 
        alt: 'bwin' 
      },
      odds: [
        { id: 'home_bwin', value: 2.12, label: '1', trend: 'up' as const },
        { id: 'draw_bwin', value: 3.42, label: 'X', trend: 'stable' as const },
        { id: 'away_bwin', value: 3.22, label: '2', trend: 'down' as const },
      ]
    },
    {
      provider: { 
        name: 'Pinnacle', 
        logo: getLogo('pinnacle'), 
        alt: 'Pinnacle' 
      },
      odds: [
        { id: 'home_pinnacle', value: 2.25, label: '1', trend: 'up' as const },
        { id: 'draw_pinnacle', value: 3.55, label: 'X', trend: 'stable' as const },
        { id: 'away_pinnacle', value: 3.35, label: '2', trend: 'down' as const },
      ]
    }
  ];

  const findBestOdds = (oddsValues: number[]) => {
    const max = Math.max(...oddsValues);
    return oddsValues.map(value => value === max);
  };

  return (
    <>
      <Container>
        <div>
          <SectionHeader>
            <SectionTitle>Match Result (1X2)</SectionTitle>
            <CompareButtonHeader onClick={() => handleCompareClick('Match Result', ['1', 'X', '2'])}>
              Compare odds
              <ChevronIcon />
            </CompareButtonHeader>
          </SectionHeader>
          <OddsRow
            odds={matchResultOdds.map(odd => ({
              ...odd,
              isSelected: selectedOdds.has(odd.id),
            }))}
            onOddClick={handleOddClick}
          />
        </div>

        <div>
          <SectionHeader>
            <SectionTitle>Over / Under 2.5 Goals</SectionTitle>
            <CompareButtonHeader onClick={() => handleCompareClick('Over / Under 2.5', ['Over', 'Under'])}>
              Compare odds
              <ChevronIcon />
            </CompareButtonHeader>
          </SectionHeader>
          <OddsRow
            odds={overUnderOdds.map(odd => ({
              ...odd,
              isSelected: selectedOdds.has(odd.id),
            }))}
            onOddClick={handleOddClick}
          />
        </div>

        <div>
          <SectionHeader>
            <SectionTitle>Betting Providers Comparison</SectionTitle>
            <CompareButtonHeader onClick={() => handleCompareClick('Match Result', ['1', 'X', '2'])}>
              Compare odds
              <ChevronIcon />
            </CompareButtonHeader>
          </SectionHeader>
          {altBettingProviders.map((provider, index) => (
            <OddsRowAlt
              key={index}
              bettingProvider={provider.provider}
              odds={provider.odds.map(odd => ({
                ...odd,
                isSelected: selectedOdds.has(odd.id),
              }))}
              onOddClick={handleOddClick}
            />
          ))}
        </div>
      </Container>

      <ModalOverlay $isOpen={modalData.isOpen} onClick={closeModal}>
        <ModalContent $isOpen={modalData.isOpen} onClick={(e) => e.stopPropagation()}>
          <DragHandle />
          <ModalHeader>
            <ModalTitle>Compare Odds - {modalData.marketName}</ModalTitle>
            <CloseButton onClick={closeModal}>
              <IoClose size={24} />
            </CloseButton>
          </ModalHeader>
          
          <ScrollableContent>
            <OddsHeader>
              <div></div>
              <OddsHeaderLabels>
                {modalData.oddsLabels?.map((label, idx) => (
                  <OddsHeaderLabel key={idx}>{label}</OddsHeaderLabel>
                ))}
              </OddsHeaderLabels>
            </OddsHeader>
            
            {modalData.providers.map((provider, idx) => {
              const oddsValues = provider.odds.map(odd => odd.value);
              const isBestArray = findBestOdds(oddsValues);
              
              return (
                <ProviderRow key={idx}>
                  <ProviderLogoModal>
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      sizes="60px"
                      style={{ objectFit: 'contain' }}
                    />
                  </ProviderLogoModal>
                  <ProviderOdds>
                    {provider.odds.map((odd, oddIdx) => (
                      <OddButtonStyled key={oddIdx} $isBest={isBestArray[oddIdx]}>
                        {odd.value.toFixed(2)}
                      </OddButtonStyled>
                    ))}
                  </ProviderOdds>
                </ProviderRow>
              );
            })}
          </ScrollableContent>
        </ModalContent>
      </ModalOverlay>
    </>
  );
};

export default OddsDetailScreen;