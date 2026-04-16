'use client'

import Feed from '@/components/feed';
import OddScoreItem from '@/components/oddScoreItem';
import Widget from '@/components/oddScoreItem';
import PredictionFeed from '@/components/predictionFeed';
import ScoreItem from '@/components/scoreItem';
import { matches } from '@/data/matches';
import Image from 'next/image';
import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    padding: 16px 16px 100px 16px;
    box-sizing: border-box;

    @media only screen and (max-width: 576px) { 
        padding: 16px;
    }

    @media only screen and (min-width: 577px) and (max-width: 768px) { 
        padding: 20px;
    }
`

const ContentInside = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding: 0px;
    gap: 8px;
    box-sizing: border-box;
`

const page = () => {
  return (
    <Wrapper>
      <ContentInside>
        <PredictionFeed/>
      </ContentInside>
    </Wrapper>
  )
}

export default page