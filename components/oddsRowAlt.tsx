'use client'

import React from 'react';
import styled from 'styled-components';
import OddButton from './oddsButton';
import Image from 'next/image';

interface OddsRowAltProps {
  bettingProvider: {
    name: string;
    logo: string;
    alt?: string;
  };
  odds: Array<{
    id: string;
    value: number;
    label?: string;
    trend?: 'up' | 'down' | 'stable';
    isLocked?: boolean;
    isSelected?: boolean;
  }>;
  onOddClick?: (id: string, value: number) => void;
  className?: string;
}

const RowContainerAlt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.fade};
  }
`;

const ProviderLogo = styled.div`
  position: relative;
  height: 20px; 
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ProviderImage = styled(Image)`
  object-fit: contain;
  width: auto !important;
  height: 100% !important;
  position: relative !important;
`;

const OddsWrapperAlt = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const OddsRowAlt: React.FC<OddsRowAltProps> = ({
  bettingProvider,
  odds,
  onOddClick,
  className,
}) => {
  const getVariant = (): 'single' | 'double' | 'triple' => {
    if (odds.length === 1) return 'single';
    if (odds.length === 2) return 'double';
    return 'triple';
  };

  const variant = getVariant();

  return (
    <RowContainerAlt className={className}>
      <ProviderLogo>
        <ProviderImage
          src={bettingProvider.logo}
          alt={bettingProvider.alt || bettingProvider.name}
          width={0}
          height={20}
          sizes="auto"
          style={{ width: 'auto', height: '22px' }}
        />
      </ProviderLogo>
      <OddsWrapperAlt>
        {odds.map((odd) => (
          <OddButton
            key={odd.id}
            odds={odd.value}
            label={odd.label}
            isLocked={odd.isLocked}
            isSelected={odd.isSelected}
            trend={odd.trend}
            variant={variant}
            onClick={() => onOddClick?.(odd.id, odd.value)}
          />
        ))}
      </OddsWrapperAlt>
    </RowContainerAlt>
  );
};

export default OddsRowAlt;