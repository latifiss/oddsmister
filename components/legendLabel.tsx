'use client'

import Image from 'next/image';
import React from 'react'
import styled from 'styled-components';

const TeamBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  width: 100%;
`

const TeamText = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: left;
`

const Badge = styled(Image)`
  width: 14px;
  height: 14px;
  object-fit: contain;
`

interface LegendLabelProps {
  teamName: string;
  badgeUrl: string;
}

const LegendLabel = ({ teamName, badgeUrl }: LegendLabelProps) => {
  return (
    <TeamBlock>
      <Badge src={badgeUrl} width={14} height={14} alt='badge' />
      <TeamText>{teamName}</TeamText>
    </TeamBlock>
  )
}

export default LegendLabel