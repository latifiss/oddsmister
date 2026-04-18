'use client'

import { useParams } from 'next/navigation';
import { useMatches, useOdds, usePredictions } from '@/hooks/useFootballData';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IoChevronForward, IoClose } from 'react-icons/io5';

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

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.fade};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-bottom: 20px;
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const TeamBadge = styled(Image)`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const TeamName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Score = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.hot};
  padding: 0 20px;
`;

const VsText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayText};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayText};
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const OddsSection = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-bottom: 20px;
`;

const OddsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const OddsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const OddsHeaderLabels = styled.div`
  display: flex;
  gap: 8px;
`;

const OddsHeaderLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayText};
  min-width: 60px;
  text-align: center;
`;

const BookmakerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const BookmakerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const BookmakerLogo = styled(Image)`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const BookmakerName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const OddsValues = styled.div`
  display: flex;
  gap: 8px;
`;

const OddValue = styled.span<{ $isBest?: boolean }>`
  min-width: 60px;
  text-align: center;
  font-size: 14px;
  font-weight: ${({ $isBest }) => $isBest ? '700' : '500'};
  color: ${({ $isBest, theme }) => $isBest ? '#2db84b' : theme.colors.text};
`;

const ViewAllButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.fade};
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  pointer-events: ${({ $isOpen }) => $isOpen ? 'auto' : 'none'};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayText};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;

const ModalScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #f80000;
`;

const PredictionsSection = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-bottom: 20px;
`;

const PredictionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const PredictionGrid = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-around;
`;

const PredictionCard = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px;
  background: ${({ theme }) => theme.colors.fade};
  border-radius: 8px;
`;

const PredictionLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayText};
  margin-bottom: 8px;
`;

const PredictionValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const PredictionUnit = styled.span`
  font-size: 12px;
  font-weight: 500;
`;

const getMatchStatus = (status: string): string => {
  if (status === '1H' || status === '2H') return 'Live';
  if (status === 'HT') return 'Halftime';
  if (status === 'FT') return 'Full Time';
  if (status === 'NS') return 'Not Started';
  return status || 'Scheduled';
};

export default function MatchDetailPage() {
  const params = useParams();
  const fixtureId = parseInt(params.id as string);
  const { matches, isLoading: matchesLoading } = useMatches();
  const { odds, isLoading: oddsLoading } = useOdds(fixtureId);
  const { prediction, isLoading: predictionLoading } = usePredictions(fixtureId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const match = matches?.find((m: any) => m.fixture.id === fixtureId);
  
  const allBookmakers = odds || [];
  const displayBookmakers = allBookmakers.slice(0, 3);
  const hasMoreBookmakers = allBookmakers.length > 3;

  const getBestOdds = (bookmakers: any[]) => {
    if (!bookmakers.length) return [];
    const homeOdds = bookmakers.map(b => b.bets?.[0]?.values?.find((v: any) => v.value === 'Home')?.odd || 0);
    const drawOdds = bookmakers.map(b => b.bets?.[0]?.values?.find((v: any) => v.value === 'Draw')?.odd || 0);
    const awayOdds = bookmakers.map(b => b.bets?.[0]?.values?.find((v: any) => v.value === 'Away')?.odd || 0);
    
    return {
      home: Math.max(...homeOdds),
      draw: Math.max(...drawOdds),
      away: Math.max(...awayOdds)
    };
  };

  const bestOdds = getBestOdds(allBookmakers);

  if (matchesLoading || oddsLoading || predictionLoading) {
    return (
      <Wrapper>
        <Container>
          <LoadingSpinner>Loading match details...</LoadingSpinner>
        </Container>
      </Wrapper>
    );
  }

  if (!match) {
    return (
      <Wrapper>
        <Container>
          <BackButton href="/">← Back to Matches</BackButton>
          <ErrorMessage>Match not found</ErrorMessage>
        </Container>
      </Wrapper>
    );
  }

  const fixture = match.fixture;
  const teams = match.teams;
  const goals = match.goals;
  const league = match.league;

  return (
    <Wrapper>
      <Container>
        <BackButton href="/">← Back to Matches</BackButton>
        
        <Header>
          <TeamSection>
            <TeamBadge src={teams.home.logo} alt={teams.home.name} width={80} height={80} />
            <TeamName>{teams.home.name}</TeamName>
          </TeamSection>
          
          <div style={{ textAlign: 'center' }}>
            <Score>{goals.home !== null ? `${goals.home} - ${goals.away}` : 'vs'}</Score>
            <VsText>{getMatchStatus(fixture.status.short)}</VsText>
          </div>
          
          <TeamSection>
            <TeamBadge src={teams.away.logo} alt={teams.away.name} width={80} height={80} />
            <TeamName>{teams.away.name}</TeamName>
          </TeamSection>
        </Header>

        <InfoSection>
          <InfoRow>
            <InfoLabel>Competition</InfoLabel>
            <InfoValue>{league.name} - {league.round}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Date & Time</InfoLabel>
            <InfoValue>{new Date(fixture.date).toLocaleString()}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Venue</InfoLabel>
            <InfoValue>{fixture.venue?.name || 'TBD'}, {fixture.venue?.city || ''}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Referee</InfoLabel>
            <InfoValue>{fixture.referee || 'TBD'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Status</InfoLabel>
            <InfoValue>
              {fixture.status.long}
              {fixture.status.elapsed && ` (${fixture.status.elapsed}')`}
            </InfoValue>
          </InfoRow>
        </InfoSection>

        {prediction && (
          <PredictionsSection>
            <PredictionTitle>Match Predictions</PredictionTitle>
            <PredictionGrid>
              <PredictionCard>
                <PredictionLabel>Home Win</PredictionLabel>
                <PredictionValue>{prediction.predictions?.win_percentage || 0}<PredictionUnit>%</PredictionUnit></PredictionValue>
              </PredictionCard>
              <PredictionCard>
                <PredictionLabel>Draw</PredictionLabel>
                <PredictionValue>{prediction.predictions?.draw_percentage || 0}<PredictionUnit>%</PredictionUnit></PredictionValue>
              </PredictionCard>
              <PredictionCard>
                <PredictionLabel>Away Win</PredictionLabel>
                <PredictionValue>{prediction.predictions?.lose_percentage || 0}<PredictionUnit>%</PredictionUnit></PredictionValue>
              </PredictionCard>
            </PredictionGrid>
            
            {prediction.predictions?.goals && (
              <PredictionGrid style={{ marginTop: '16px' }}>
                <PredictionCard>
                  <PredictionLabel>Over 2.5 Goals</PredictionLabel>
                  <PredictionValue>{prediction.predictions.goals.over_percentage || 0}<PredictionUnit>%</PredictionUnit></PredictionValue>
                </PredictionCard>
                <PredictionCard>
                  <PredictionLabel>Under 2.5 Goals</PredictionLabel>
                  <PredictionValue>{prediction.predictions.goals.under_percentage || 0}<PredictionUnit>%</PredictionUnit></PredictionValue>
                </PredictionCard>
              </PredictionGrid>
            )}
          </PredictionsSection>
        )}

        <OddsSection>
          <OddsTitle>Betting Odds</OddsTitle>
          
          <OddsHeader>
            <div style={{ width: '120px' }}>Bookmaker</div>
            <OddsHeaderLabels>
              <OddsHeaderLabel>Home</OddsHeaderLabel>
              <OddsHeaderLabel>Draw</OddsHeaderLabel>
              <OddsHeaderLabel>Away</OddsHeaderLabel>
            </OddsHeaderLabels>
          </OddsHeader>
          
          {displayBookmakers.map((bookmaker: any, idx: number) => {
            const homeOdd = bookmaker.bets?.[0]?.values?.find((v: any) => v.value === 'Home')?.odd || '-';
            const drawOdd = bookmaker.bets?.[0]?.values?.find((v: any) => v.value === 'Draw')?.odd || '-';
            const awayOdd = bookmaker.bets?.[0]?.values?.find((v: any) => v.value === 'Away')?.odd || '-';
            
            return (
              <BookmakerRow key={idx}>
                <BookmakerInfo>
                  <BookmakerLogo src={bookmaker.bookmaker.logo} alt={bookmaker.bookmaker.name} width={40} height={40} />
                  <BookmakerName>{bookmaker.bookmaker.name}</BookmakerName>
                </BookmakerInfo>
                <OddsValues>
                  <OddValue $isBest={homeOdd === bestOdds.home}>{homeOdd !== '-' ? homeOdd.toFixed(2) : '-'}</OddValue>
                  <OddValue $isBest={drawOdd === bestOdds.draw}>{drawOdd !== '-' ? drawOdd.toFixed(2) : '-'}</OddValue>
                  <OddValue $isBest={awayOdd === bestOdds.away}>{awayOdd !== '-' ? awayOdd.toFixed(2) : '-'}</OddValue>
                </OddsValues>
              </BookmakerRow>
            );
          })}
          
          {hasMoreBookmakers && (
            <ViewAllButton onClick={() => setIsModalOpen(true)}>
              View All {allBookmakers.length} Bookmakers
            </ViewAllButton>
          )}
          
          {allBookmakers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No odds available for this match yet
            </div>
          )}
        </OddsSection>

        <ModalOverlay $isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>All Bookmakers - {teams.home.name} vs {teams.away.name}</ModalTitle>
              <ModalCloseButton onClick={() => setIsModalOpen(false)}>
                <IoClose size={24} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalScrollableContent>
              <OddsHeader>
                <div style={{ width: '120px' }}>Bookmaker</div>
                <OddsHeaderLabels>
                  <OddsHeaderLabel>Home</OddsHeaderLabel>
                  <OddsHeaderLabel>Draw</OddsHeaderLabel>
                  <OddsHeaderLabel>Away</OddsHeaderLabel>
                </OddsHeaderLabels>
              </OddsHeader>
              {allBookmakers.map((bookmaker: any, idx: number) => {
                const homeOdd = bookmaker.bets?.[0]?.values?.find((v: any) => v.value === 'Home')?.odd || '-';
                const drawOdd = bookmaker.bets?.[0]?.values?.find((v: any) => v.value === 'Draw')?.odd || '-';
                const awayOdd = bookmaker.bets?.[0]?.values?.find((v: any) => v.value === 'Away')?.odd || '-';
                
                return (
                  <BookmakerRow key={idx}>
                    <BookmakerInfo>
                      <BookmakerLogo src={bookmaker.bookmaker.logo} alt={bookmaker.bookmaker.name} width={40} height={40} />
                      <BookmakerName>{bookmaker.bookmaker.name}</BookmakerName>
                    </BookmakerInfo>
                    <OddsValues>
                      <OddValue $isBest={homeOdd === bestOdds.home}>{homeOdd !== '-' ? homeOdd.toFixed(2) : '-'}</OddValue>
                      <OddValue $isBest={drawOdd === bestOdds.draw}>{drawOdd !== '-' ? drawOdd.toFixed(2) : '-'}</OddValue>
                      <OddValue $isBest={awayOdd === bestOdds.away}>{awayOdd !== '-' ? awayOdd.toFixed(2) : '-'}</OddValue>
                    </OddsValues>
                  </BookmakerRow>
                );
              })}
            </ModalScrollableContent>
          </ModalContent>
        </ModalOverlay>
      </Container>
    </Wrapper>
  );
}