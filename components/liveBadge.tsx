'use client'

import React from 'react';
import styled, { keyframes } from 'styled-components';

const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 4px;
    border: 1px solid var(--spf-milano-red);
`;

const Label = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: var(--spf-milano-red);
  font-family: inherit ;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
`;

const Torcher = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4px;
    height: 4px;
    background-color: var(--spf-milano-red);
    border-radius: 50%;
    margin-right: 4px;
    animation: ${blinkAnimation} 1s ease-in-out infinite;
`;

const LiveBadge = () => {
    return (
        <Wrapper>
            <Torcher />
            <Label>LIVE</Label>
        </Wrapper>
    );
};

export default LiveBadge;
