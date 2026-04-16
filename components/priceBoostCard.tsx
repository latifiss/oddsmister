'use client'

import React from 'react'
import styled from 'styled-components'
import BoostIcon from './boostIcon'

const Card = styled.div`
  width: 280px;
  padding: 16px 18px;
  border-radius: 8px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.fade}, ${({ theme }) => theme.colors.fader});
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const BoostBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.boost};
  color: ${({ theme }) => theme.colors.boost};
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Title = styled.div`
  font-size: 14px;
  margin-bottom: 14px;
  color: ${({ theme }) => theme.colors.grayText};
  line-height: 1.4;
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MatchItemWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const DotColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.boost};
  border-radius: 50%;
  flex-shrink: 0;
`;

const Line = styled.div`
  width: 1.5px;
  flex-grow: 1;
  min-height: 8px;
  background: ${({ theme }) => theme.colors.boost};
  margin-left: 1px;
`;

const MatchText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  display: block;
  padding-bottom: 10px;
  margin-top: -4px;
`;

const OddsContainer = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.fade};
  border: 1.5px solid rgba(35, 223, 140, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OddsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OddsText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.grayText};
  white-space: nowrap;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

const OddsIcon = styled(BoostIcon)`
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
`;

const PriceBoostCard = () => {
  const matches = [
    'Real Madrid - Bayern Munich',
    'Sporting Lisbon - Arsenal',
    'FC Barcelona - Atlético Madrid',
    'PSG - Liverpool'
  ]

  return (
    <Card>
      <Header>
        <BoostBadge>
          <BoostIcon />
          Price Boost
        </BoostBadge>
      </Header>
      <Title>Both Teams to Score</Title>
      <MatchList>
        {matches.map((match, index) => (
          <MatchItemWrapper key={index}>
            <DotColumn>
              <Dot />
              {index !== matches.length - 1 && <Line />}
            </DotColumn>
            <MatchText>{match}</MatchText>
          </MatchItemWrapper>
        ))}
      </MatchList>
      <OddsContainer>
        <OddsContent>
          <OddsText>3.71/1</OddsText>
          <Highlight>4.27/1</Highlight>
          <OddsIcon />
        </OddsContent>
      </OddsContainer>
    </Card>
  )
}

export default PriceBoostCard