'use client'

import React from 'react';
import styled from 'styled-components';
import HeadStat from './headStat';
import Image from 'next/image';

const Component = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 44px;
    padding: 16px 16px;

     @media only screen and (max-width: 576px) { 
        gap: 26px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        gap: 30px;
    }
`

const StatBadge = styled(Image)`
    width: 48px;
    height: 48px;

     @media only screen and (max-width: 576px) { 
        width: 38px;
    height: 38px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        width: 38px;
    height: 38px;
    }
`

const StatHome = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: fit-content;
    gap: 8px;
`

const StatAway = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: fit-content;
    gap: 8px;
`

const StatBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: fit-content;
`

const StatText = styled.div`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  white-space: nowrap;
`

const HeadStatItem = () => {
  return (
      <Component>
          <StatHome>
              <StatBadge src='https://images.fotmob.com/image_resources/logo/teamlogo/8344.png' alt='hometeam' width={48} height={48}/>
          <StatBlock>
              <HeadStat value="1175" bgColor="#DA291C" textColor="#FFFFFF" />
              <StatText>Wins</StatText>
          </StatBlock>
          </StatHome>
          <StatBlock>
              <HeadStat value="24" bgColor="#034694" textColor="#FFD700" />
              <StatText>Draws</StatText>
          </StatBlock>
          <StatAway>
          <StatBlock>
              <HeadStat value="18" bgColor="#555" textColor="#FFFFFF" />
              <StatText>Wins</StatText>
          </StatBlock>
              <StatBadge src='https://images.fotmob.com/image_resources/logo/teamlogo/8455.png' alt='hometeam' width={48} height={48}/>
          </StatAway>
    </Component>
  )
}

export default HeadStatItem