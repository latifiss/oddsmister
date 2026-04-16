'use client'

import Image from 'next/image';
import React from 'react'
import styled from 'styled-components';

const SLANT = 14;

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Shape = styled.div`
  display: flex;
  align-items: center;
  height: 17px;
  padding: 0px 38px 0px 8px;
  background-color: ${({ theme }) => theme.colors.best};

  clip-path: polygon(
    0 0,
    calc(100% - ${SLANT}px) 0,
    100% 100%,
    0% 100%
  );
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  text-transform: uppercase;
  font-style: italic;
  white-space: nowrap;
  margin: 0;
  line-height: 1;
`;

const TagImage = styled(Image)`
  position: absolute;
  top: -2px;
  right: 18px;
  width: 15px;
  height: 16px;
  z-index: 2;
`;

const BestOddTag = () => {
  return (
    <Wrapper>
      <Shape>
        <Label>BEST ODDS</Label>
      </Shape>
      <TagImage
        src="/assets/icons/medal.png"
        alt="Medal Icon"
        width={14}
        height={14}
      />
    </Wrapper>
  )
}

export default BestOddTag;