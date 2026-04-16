'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import OddButton from './oddsButton';
import { IoChevronForward } from 'react-icons/io5';

interface OddsRowProps {
  odds: Array<{
    id: string;
    value: number;
    label?: string;
    trend?: 'up' | 'down' | 'stable';
    isLocked?: boolean;
    isSelected?: boolean;
  }>;
  onOddClick?: (id: string, value: number) => void;
  showCompare?: boolean;
  onCompareClick?: () => void;
  className?: string;
}

const RowContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
  align-items: center;
`;

const CompareButton = styled.button`
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

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.fade};
  }
`;

const ChevronIcon = styled(IoChevronForward)`
  font-size: 12px;
`;

const OddsWrapper = styled.div<{ $showCompare: boolean }>`
  display: flex;
  gap: 8px;
  flex: 1;
`;

const OddsRow: React.FC<OddsRowProps> = ({
  odds,
  onOddClick,
  showCompare = false,
  onCompareClick,
  className,
}) => {
  const getVariant = (): 'single' | 'double' | 'triple' => {
    if (odds.length === 1) return 'single';
    if (odds.length === 2) return 'double';
    return 'triple';
  };

  const variant = getVariant();

  return (
    <RowContainer className={className}>
      <OddsWrapper $showCompare={showCompare}>
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
      </OddsWrapper>
      {showCompare && (
        <CompareButton onClick={onCompareClick}>
          Compare odds
          <ChevronIcon />
        </CompareButton>
      )}
    </RowContainer>
  );
};

export default OddsRow;