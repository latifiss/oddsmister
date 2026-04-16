'use client'

import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const Component = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.adBg};
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
`

const StyledImage = styled(Image)`
    width: 16px;
    height: 16px;
    object-fit: contain;
    margin-right: 8px;
`

const HeadText = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: left;
`;

interface OddScoreHeadProps {
    logo: string;
    competition: string;
}

const OddScoreHead = ({ logo, competition }: OddScoreHeadProps) => {
  return (
      <Component>
          <StyledImage src={logo} alt={competition} width={16} height={16} />
            <HeadText>{competition}</HeadText>
    </Component>
  )
}

export default OddScoreHead