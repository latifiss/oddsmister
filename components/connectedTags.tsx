'use client'

import Image from 'next/image';
import React from 'react'
import styled from 'styled-components';

const SLANT = 14;

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

const HotShape = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 17px;
  padding: 0px 33px 0px 8px;
  background-color: ${({ theme }) => theme.colors.hot};
  z-index: 2;

  clip-path: polygon(
    0 0,
    calc(100% - ${SLANT}px) 0,
    100% 100%,
    0% 100%
  );
`;

const BestShape = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 17px;
  padding: 0px 38px 0px ${({ theme }) => SLANT + 4}px;
  background-color: ${({ theme }) => theme.colors.best};
  clip-path: polygon(
    0 0,
    calc(100% - ${SLANT}px) 0,
    100% 100%,
    ${SLANT}px 100%
  );
  margin-left: -${SLANT}px;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  text-transform: uppercase;
  font-style: italic;
  white-space: nowrap;
  line-height: 1;
`;

const HotIcon = styled(Image)`
  position: absolute;
  top: -2px;
  right: 14px;
  width: 15px;
  height: 16px;
  z-index: 3;
`;

const MedalIcon = styled(Image)`
  position: absolute;
  top: -2px;
  right: 18px;
  width: 15px;
  height: 16px;
  z-index: 3;
`;

const ConnectedTags = () => {
  return (
    <Wrapper>
      <HotShape>
        <Label>HOT</Label>
        <HotIcon src="/assets/icons/fire.png" alt="Hot Icon" width={14} height={14} />
      </HotShape>

      <BestShape>
        <Label>BEST ODDS</Label>
        <MedalIcon src="/assets/icons/medal.png" alt="Medal Icon" width={14} height={14} />
      </BestShape>
    </Wrapper>
  )
}

export default ConnectedTags;