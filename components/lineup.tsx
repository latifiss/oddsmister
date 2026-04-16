'use client'

import React from 'react';
import styled from 'styled-components';

interface Player {
  number: number;
  name: string;
  position?: string;
}

interface TeamLineup {
  teamName: string;
  badgeUrl: string;
  manager: string;
  formation: string;
  primaryColor?: string;
  secondaryColor?: string;
  goalkeeper: Player;
  defenders: Player[];
  midfielders: Player[];
  attackers: Player[];
}

interface LineupProps {
  homeTeam: TeamLineup;
  awayTeam: TeamLineup;
  isActive?: boolean;
}

const Wrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors?.white || '#fff' : 'transparent'};
  border: ${({ $isActive, theme }) =>
    $isActive ? `1px solid ${theme.colors?.border || '#e0e0e0'}` : 'none'};
  box-shadow: ${({ $isActive }) =>
    $isActive ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none'};
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TeamHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${({ theme }) => theme.colors?.border || '#e0e0e0'};
`;

const TeamTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: inherit;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#333'};
  margin-bottom: 8px;
`;

const TeamBadge = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 20px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.grayText || '#666'};
  flex-wrap: wrap;
`;

const InfoText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.grayText || '#666'};
  font-family: inherit;

  strong {
    color: ${({ theme }) => theme.colors?.text || '#333'};
    font-weight: 700;
  }
`;

const Pitch = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(135deg, #1a5c2a, #0d3d1a);
  border-radius: 12px;
  padding: 12px 12px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(255, 255, 255, 0.05) 40px,
      rgba(255, 255, 255, 0.05) 80px
    );
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 40px,
      rgba(255, 255, 255, 0.03) 40px,
      rgba(255, 255, 255, 0.03) 80px
    );
    pointer-events: none;
  }
`;

const PenaltyBox = styled.div<{ $isHome?: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 65%;
  height: 45px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top: none;
  transform: translateX(-50%);
  z-index: 0;
  border-radius: 0 0 8px 8px;
`;

const GoalBox = styled.div<{ $isHome?: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 35%;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top: none;
  transform: translateX(-50%);
  z-index: 0;
  border-radius: 0 0 6px 6px;
`;

const PenaltySpot = styled.div`
  position: absolute;
  top: 28px;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 0;
`;

const CenterCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 45px;
  height: 45px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

const CenterSpot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  z-index: 1;
  flex-wrap: wrap;
  margin: 2px 0;
`;

const Player = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const PlayerCircle = styled.div<{ $isGoalkeeper?: boolean; $primaryColor?: string }>`
  width: 38px;
  height: 38px;
  background: ${({ $primaryColor }) => 
    $primaryColor 
      ? `linear-gradient(135deg, ${$primaryColor}, ${$primaryColor}cc)`
      : 'linear-gradient(135deg, #ffd700, #ffb800)'};
  border: 2px solid ${({ $primaryColor }) => 
    $primaryColor 
      ? `${$primaryColor}99`
      : '#d4a000'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: inherit;
  font-size: 13px;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PlayerName = styled.span`
  font-size: 10px;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  text-align: center;
  max-width: 65px;
  line-height: 1.2;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
`;

const PlayerNumber = styled.span`
  font-size: 9px;
  font-weight: 500;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

const VersusDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 12px 0;
  padding: 8px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors?.border || '#e0e0e0'};
  }
`;

const VersusText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.grayText || '#999'};
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Lineup: React.FC<LineupProps> = ({
  homeTeam,
  awayTeam,
  isActive = true,
}) => {
  const renderPlayers = (players: Player[], primaryColor?: string, isGoalkeeper: boolean = false) => (
    <Row>
      {players.map((player) => (
        <Player key={player.number}>
          <PlayerCircle $isGoalkeeper={isGoalkeeper} $primaryColor={primaryColor}>
            {player.number}
          </PlayerCircle>
          <PlayerName>{player.name}</PlayerName>
          <PlayerNumber>{player.position || ''}</PlayerNumber>
        </Player>
      ))}
    </Row>
  );

  const renderTeam = (team: TeamLineup, isHome: boolean) => {
    const primaryColor = team.primaryColor || (isHome ? '#ef0107' : '#034694');
    
    return (
      <TeamSection>
        <TeamHeader>
          <TeamTitle>
            <TeamBadge src={team.badgeUrl} alt={team.teamName} />
            {team.teamName}
          </TeamTitle>
          <InfoRow>
            <InfoText>Manager: <strong>{team.manager}</strong></InfoText>
            <InfoText>Formation: <strong>{team.formation}</strong></InfoText>
          </InfoRow>
        </TeamHeader>

        <Pitch>
          <PenaltyBox $isHome={isHome} />
          <GoalBox $isHome={isHome} />
          <PenaltySpot />
          <CenterCircle />
          <CenterSpot />

          {renderPlayers([team.goalkeeper], primaryColor, true)}
          {renderPlayers(team.defenders, primaryColor)}
          {renderPlayers(team.midfielders, primaryColor)}
          {renderPlayers(team.attackers, primaryColor)}
        </Pitch>
      </TeamSection>
    );
  };

  return (
    <Wrapper $isActive={isActive}>
      {renderTeam(homeTeam, true)}
      
      <VersusDivider>
        <VersusText>VS</VersusText>
      </VersusDivider>
      
      {renderTeam(awayTeam, false)}
    </Wrapper>
  );
};

export default Lineup;