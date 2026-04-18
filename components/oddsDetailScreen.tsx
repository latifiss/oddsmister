'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import OddsRow from './oddsRow';
import { IoChevronForward, IoClose } from 'react-icons/io5';
import { getProviderLogo, bettingProviders } from '@/utils/bettingProviders';
import { useBettingProvider } from '@/hooks/useBettingProvider';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.grayText};
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.error || '#ff4444'};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  width: 100%;
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
    transform: translateY($({ $isOpen }) => $isOpen ? '0%' : '100%'});
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
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

interface ApiOdds {
  id: number;
  fixture: { id: number };
  bookmakers: Array<{
    id: number;
    name: string;
    bets: Array<{
      id: number;
      name: string;
      values: Array<{
        value: string;
        odd: string;
      }>;
    }>;
  }>;
}

interface OddsMarket {
  name: string;
  displayName: string;
  odds: Array<{ id: string; value: number; label: string }>;
  labels: string[];
}

interface OddsDetailScreenProps {
  fixtureId?: number | string;
  initialOddsData?: any;
}

const OddsDetailScreen = ({ fixtureId, initialOddsData }: OddsDetailScreenProps) => {
  const { getLogo, currentTheme } = useBettingProvider();
  const [selectedOdds, setSelectedOdds] = useState<Map<string, boolean>>(new Map());
  const [oddsData, setOddsData] = useState<ApiOdds | null>(initialOddsData || null);
  const [loading, setLoading] = useState(!initialOddsData);
  const [error, setError] = useState<string | null>(null);
  const [availableMarkets, setAvailableMarkets] = useState<OddsMarket[]>([]);
  
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

  const hasValidLogo = (providerName: string): boolean => {
    const normalizedName = providerName.toLowerCase().replace(/\s+/g, '');
    const provider = bettingProviders.find(p => 
      p.id === normalizedName || 
      p.apiName?.some(apiName => apiName.toLowerCase() === providerName.toLowerCase())
    );
    if (!provider) return false;
    
    const logo = getLogo(provider.id, currentTheme);
    return logo !== '/icons/default-bookmaker.svg' && logo !== '';
  };

  useEffect(() => {
    if (initialOddsData) {
      setOddsData(initialOddsData);
      setLoading(false);
      return;
    }
    
    const fetchOdds = async () => {
      if (!fixtureId) {
        setError('No fixture ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/odds?fixtureId=${fixtureId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch odds');
        }
        const data = await response.json();
        setOddsData(data.response?.[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load odds data');
        console.error('Error fetching odds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [fixtureId, initialOddsData]);

  useEffect(() => {
    if (!oddsData?.bookmakers || oddsData.bookmakers.length === 0) return;

    const filteredBookmakers = oddsData.bookmakers.filter(bookmaker => 
      hasValidLogo(bookmaker.name)
    );

    if (filteredBookmakers.length === 0) return;

    const allBets = new Map<string, Set<string>>();
    
    filteredBookmakers.forEach(bookmaker => {
      bookmaker.bets.forEach(bet => {
        if (!allBets.has(bet.name)) {
          allBets.set(bet.name, new Set());
        }
        bet.values.forEach(value => {
          allBets.get(bet.name)?.add(value.value);
        });
      });
    });

    const marketConfig: Record<string, { displayName: string, getLabels: (values: string[]) => string[] }> = {
      'Match Winner': { displayName: 'Match Result (1X2)', getLabels: (values) => values.map(v => v === 'Home' ? '1' : v === 'Draw' ? 'X' : '2') },
      'Double Chance': { displayName: 'Double Chance', getLabels: (values) => values },
      'Both Teams Score': { displayName: 'Both Teams to Score', getLabels: (values) => values },
      'Goals Over/Under': { displayName: 'Over/Under Goals', getLabels: (values) => values },
      'First Half Winner': { displayName: 'First Half Winner', getLabels: (values) => values.map(v => v === 'Home' ? '1' : v === 'Draw' ? 'X' : '2') },
      'Second Half Winner': { displayName: 'Second Half Winner', getLabels: (values) => values.map(v => v === 'Home' ? '1' : v === 'Draw' ? 'X' : '2') },
      'Asian Handicap': { displayName: 'Asian Handicap', getLabels: (values) => values },
      'Handicap Result': { displayName: 'Handicap Result', getLabels: (values) => values },
      'HT/FT Double': { displayName: 'Half Time/Full Time', getLabels: (values) => values },
      'Exact Score': { displayName: 'Correct Score', getLabels: (values) => values },
      'Highest Scoring Half': { displayName: 'Highest Scoring Half', getLabels: (values) => values },
      'Odd/Even': { displayName: 'Odd/Even Total Goals', getLabels: (values) => values },
      'Team To Score First': { displayName: 'First Goal Scorer', getLabels: (values) => values },
      'Win To Nil': { displayName: 'Win to Nil', getLabels: (values) => values },
    };

    const markets: OddsMarket[] = [];

    for (const [betName, valueSet] of allBets.entries()) {
      const config = marketConfig[betName];
      if (!config) continue;

      const values = Array.from(valueSet);
      const labels = config.getLabels(values);
      
      const bookmakerWithBet = filteredBookmakers.find(bookmaker =>
        bookmaker.bets.some(bet => bet.name === betName)
      );

      if (bookmakerWithBet) {
        const bet = bookmakerWithBet.bets.find(b => b.name === betName);
        if (bet) {
          const odds = bet.values.map((value, idx) => ({
            id: `${betName}_${value.value}_${idx}`,
            value: parseFloat(value.odd),
            label: labels[idx] || value.value,
          }));
          
          markets.push({
            name: betName,
            displayName: config.displayName,
            odds: odds,
            labels: labels,
          });
        }
      }
    }

    setAvailableMarkets(markets);
  }, [oddsData, currentTheme]);

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
  };

  const handleCompareClick = (marketName: string, oddsLabels: string[]) => {
    if (!oddsData?.bookmakers) return;
    
    const filteredBookmakers = oddsData.bookmakers.filter(bookmaker => 
      hasValidLogo(bookmaker.name)
    );
    
    const providers = filteredBookmakers.map(bookmaker => {
      const bet = bookmaker.bets.find(b => b.name === marketName);
      if (!bet) return null;
      
      const normalizedName = bookmaker.name.toLowerCase().replace(/\s+/g, '');
      
      return {
        name: bookmaker.name,
        logo: getLogo(normalizedName),
        odds: bet.values.map((value, idx) => ({
          id: `${bookmaker.name}_${value.value}_${idx}`,
          value: parseFloat(value.odd),
          label: oddsLabels[idx] || value.value
        }))
      };
    }).filter(provider => provider !== null) as Array<{
      name: string;
      logo: string;
      odds: Array<{ id: string; value: number; label?: string }>;
    }>;
    
    setModalData({
      isOpen: true,
      marketName,
      providers,
      oddsLabels: oddsLabels,
    });
  };

  const closeModal = () => {
    setModalData({ ...modalData, isOpen: false });
  };

  if (loading) {
    return (
      <LoadingContainer>
        Loading odds data...
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        Error loading odds: {error}
      </ErrorContainer>
    );
  }

  if (!oddsData || !oddsData.bookmakers || oddsData.bookmakers.length === 0) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '20px', color: '#6d747b' }}>
          No odds available for this match
        </div>
      </Container>
    );
  }

  const findBestOdds = (oddsValues: number[]) => {
    const max = Math.max(...oddsValues);
    return oddsValues.map(value => value === max);
  };

  return (
    <>
      <Container>
        {availableMarkets.map((market, index) => (
          <div key={index}>
            <SectionHeader>
              <SectionTitle>{market.displayName}</SectionTitle>
              <CompareButtonHeader onClick={() => handleCompareClick(market.name, market.labels)}>
                Compare odds
                <ChevronIcon />
              </CompareButtonHeader>
            </SectionHeader>
            <OddsRow
              odds={market.odds.map(odd => ({
                ...odd,
                isSelected: selectedOdds.has(odd.id),
                trend: 'stable' as const
              }))}
              onOddClick={handleOddClick}
            />
          </div>
        ))}
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
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
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