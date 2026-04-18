'use client'

import React from 'react';
import styled from 'styled-components';

interface OddButtonProps {
  odds: number;
  label?: string;
  isLocked?: boolean;
  isSelected?: boolean;
  trend?: 'up' | 'down' | 'stable';
  variant?: 'single' | 'double' | 'triple';
  onClick?: () => void;
  className?: string;
}

const ButtonContainer = styled.div<{ $variant: 'single' | 'double' | 'triple' }>`
  display: flex;
  flex: 1;
  min-width: 0; /* Allows flex item to shrink */
  min-width: ${({ $variant }) => {
    if ($variant === 'single') return '100%';
    if ($variant === 'double') return 'calc(50% - 4px)';
    return 'calc(33.333% - 6px)';
  }};
  
  /* Responsive breakpoints */
  @media only screen and (max-width: 480px) {
    min-width: ${({ $variant }) => {
      if ($variant === 'single') return '100%';
      if ($variant === 'double') return 'calc(50% - 4px)';
      return 'calc(50% - 4px)'; /* On mobile, triple becomes double row */
    }};
  }
`;

const OddButtonStyled = styled.button<{ 
  $isLocked: boolean; 
  $isSelected: boolean;
  $variant: 'single' | 'double' | 'triple';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-width: 0; /* Allows button to shrink */
  height: auto;
  min-height: 32px;
  padding: 6px 8px;
  border: 1px solid ${({ theme, $isSelected, $isLocked }) => {
    if ($isLocked) return theme.colors?.border || '#e0e0e0';
    if ($isSelected) return '#2db84b';
    return theme.colors?.border || '#e0e0e0';
  }};
  border-radius: 8px;
  background: ${({ theme, $isSelected, $isLocked }) => {
    if ($isLocked) return '#f5f5f5';
    if ($isSelected) return '#2db84b10';
    return 'transparent';
  }};
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme, $isLocked, $isSelected }) => {
    if ($isLocked) return theme.colors?.grayText || '#999';
    if ($isSelected) return '#2db84b';
    return theme.colors?.text || '#333';
  }};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  cursor: ${({ $isLocked }) => $isLocked ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${({ $isLocked }) => $isLocked ? 0.6 : 1};
  overflow: hidden;
  text-overflow: ellipsis;

  /* Allow text to wrap on very small screens */
  @media only screen and (max-width: 380px) {
    white-space: normal;
    word-break: keep-all;
    padding: 4px 6px;
  }

  &:hover {
    border-color: ${({ theme, $isLocked, $isSelected }) => {
      if ($isLocked) return theme.colors?.border || '#e0e0e0';
      if ($isSelected) return '#2db84b';
      return theme.colors?.text || '#333';
    }};
    background: ${({ theme, $isLocked, $isSelected }) => {
      if ($isLocked) return '#f5f5f5';
      if ($isSelected) return '#2db84b15';
      return '#f8f9fa';
    }};
  }

  &:active {
    transform: ${({ $isLocked }) => $isLocked ? 'none' : 'translateY(0)'};
  }
`;

const OddsValue = styled.span<{ $trend?: 'up' | 'down' | 'stable' }>`
  color: inherit;
  font-weight: 700;
  flex-shrink: 0;
`;

const TrendIcon = styled.span<{ $trend: 'up' | 'down' | 'stable' }>`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  color: ${({ $trend }) => {
    if ($trend === 'up') return '#2db84b';
    if ($trend === 'down') return '#f80000';
    return '#999';
  }};
  flex-shrink: 0;
`;

const LockIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  color: #999;
  margin-left: 2px;
  flex-shrink: 0;
`;

const LabelText = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: inherit;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.half};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 50px;

  @media only screen and (max-width: 380px) {
    white-space: normal;
    max-width: none;
  }
`;

const ChevronUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const LockIconSvg = () => (
  <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const OddButton: React.FC<OddButtonProps> = ({
  odds,
  label,
  isLocked = false,
  isSelected = false,
  trend = 'stable',
  variant = 'triple',
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick();
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ChevronUpIcon />;
    if (trend === 'down') return <ChevronDownIcon />;
    return null;
  };

  return (
    <ButtonContainer $variant={variant} className={className}>
      <OddButtonStyled
        $isLocked={isLocked}
        $isSelected={isSelected}
        $variant={variant}
        onClick={handleClick}
        disabled={isLocked}
      >
        {label && <LabelText>{label}</LabelText>}
        <OddsValue>{odds.toFixed(2)}</OddsValue>
        {trend !== 'stable' && (
          <TrendIcon $trend={trend}>
            {getTrendIcon()}
          </TrendIcon>
        )}
        {isLocked && (
          <LockIcon>
            <LockIconSvg />
          </LockIcon>
        )}
      </OddButtonStyled>
    </ButtonContainer>
  );
};

export default OddButton;