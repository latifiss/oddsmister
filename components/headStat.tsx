'use client'

import React from 'react'
import styled from 'styled-components'

const Component = styled.div<{ bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  padding: 12px 18px;
  border-radius: 99px;
  background-color: ${({ bgColor }) => bgColor};

  @media only screen and (max-width: 576px) { 
        width: 56px;
        height: 38px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        width: 56px;
        height: 38px;
    }
`

const HeadText = styled.div<{ textColor: string }>`
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  color: ${({ textColor }) => textColor};
  font-family: inherit;
  white-space: nowrap;
  margin-top: 2px;

  @media only screen and (max-width: 576px) { 
        font-size: 18px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        font-size: 18px;
    }
`

interface HeadStatProps {
  value: string
  bgColor: string
  textColor: string
}

const HeadStat = ({ value, bgColor, textColor }: HeadStatProps) => {
  return (
    <Component bgColor={bgColor}>
      <HeadText textColor={textColor}>{value}</HeadText>
    </Component>
  )
}

export default HeadStat
