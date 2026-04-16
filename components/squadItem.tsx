'use client'

import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const Component = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 130px 60px;
  align-items: center;
  justify-content: flex-start;
  gap: 0px;
  height: 44px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Label = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.heavyMetal};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  margin-top: 4px;
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 44px;
  gap: 8px;
`;

const BarFirst = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 44px;
  gap: 4px;
`;

const BarLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 44px;
  gap: 4px;
`;

const Badge = styled(Image)`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

interface SquadItemProps {
  playerName: string;
  country: string; 
  countryCode: string;
  position: string;
  num: string;
}

const SquadItem = ({ playerName, country, countryCode, position, num }: SquadItemProps) => {
  const flagUrl = `https://flagcdn.com/h24/${countryCode}.png`;

  return (
    <Component>
      <BarFirst>
        <Label>{num}</Label>
      </BarFirst>
      <Bar>
        <Label>{playerName}</Label>
      </Bar>
      <Bar>
        <Badge src={flagUrl} width={24} height={24} alt={country} />
        <Label>{country}</Label>
      </Bar>
      <BarLeft>
        <Label>{position}</Label>
      </BarLeft>
    </Component>
  );
};

export default SquadItem;
