'use client'

import { useParams } from 'next/navigation';
import { useMatches, useOdds } from '@/hooks/useFootballData';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
`;

const OddsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const BookmakerCard = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const BookmakerName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const OddsGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const OddItem = styled.span`
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.fade};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const BackButton = styled(Link)`
  display: inline-block;
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

export default function MatchDetailPage() {
  const params = useParams();
  const fixtureId = parseInt(params.id as string);
  const { matches } = useMatches();
  const { odds } = useOdds(fixtureId);
  
  const match = matches.find((m: any) => m.fixture.id === fixtureId);
  
  if (!match) {
    return (
      <Container>
        <BackButton href="/">← Back to Matches</BackButton>
        <div>Loading match details...</div>
      </Container>
    );
  }

  const fixture = match.fixture;
  const teams = match.teams;
  const goals = match.goals;
  const league = match.league;

  return (
    <Container>
      <BackButton href="/">← Back to Matches</BackButton>
      
      <Header>
        <TeamSection>
          <TeamBadge src={teams.home.logo} alt={teams.home.name} width={80} height={80} />
          <TeamName>{teams.home.name}</TeamName>
        </TeamSection>
        
        <div style={{ textAlign: 'center' }}>
          <Score>{goals.home !== null ? `${goals.home} - ${goals.away}` : 'vs'}</Score>
          <VsText>{fixture.status.short === 'NS' ? 'Not Started' : fixture.status.short}</VsText>
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

      {odds.length > 0 && (
        <OddsSection>
          <OddsTitle>Betting Odds</OddsTitle>
          {odds.map((bookmaker: any, idx: number) => (
            <BookmakerCard key={idx}>
              <BookmakerName>{bookmaker.bookmaker.name}</BookmakerName>
              {bookmaker.bets.map((bet: any, betIdx: number) => (
                <div key={betIdx}>
                  <OddsGrid>
                    {bet.values.map((value: any, valIdx: number) => (
                      <OddItem key={valIdx}>
                        {value.value}: {value.odd}
                      </OddItem>
                    ))}
                  </OddsGrid>
                </div>
              ))}
            </BookmakerCard>
          ))}
        </OddsSection>
      )}
    </Container>
  );
}