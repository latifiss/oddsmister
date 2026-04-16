'use client'

import React from 'react';
import styled from 'styled-components';
import ConnectedTags from './connectedTags';
import Image from 'next/image';
import ScoreTimer from './scoreTimer';

const Component = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 12px 12px 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 12px 0 0 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 1px;
`;

const MarkerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Inner = styled.div`
  display: grid;
  grid-template-columns: 1fr 45px 45px 45px;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  color: ${({ theme }) => theme.colors.grayText};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  margin: 0;
`;

const OddSign = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  color: ${({ theme }) => theme.colors.grayText};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  margin: 0;
`;

const ScoreInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 8px;
`

const TeamBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    width: 100%;
`

const TeamText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: left;
  margin-top: 2px;
`;

const Badge = styled(Image)`
    width: 18px;
    height: 18px;
    object-fit: contain;
`

const Odd = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 24px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
`

const OddScoreItem = () => {
  return (
    <Component>
      <Head></Head>
      <Content>
        <MarkerRow $scale={0.8}>
          <ConnectedTags />
        </MarkerRow>
        <Bottom>
          <Inner>
            <Date>7 Apr, 22:00</Date>
            <OddSign>1</OddSign>
            <OddSign>X</OddSign>
            <OddSign>2</OddSign>
                  </Inner>
                  <Inner>
                      <ScoreTimer minute={55} />
                      
            <OddSign>1</OddSign>
            <OddSign>X</OddSign>
            <OddSign>2</OddSign>
                  </Inner>
                  <Inner>
                      <ScoreTimer minute={45} isHalftime={true} />
                      
            <OddSign>1</OddSign>
            <OddSign>X</OddSign>
            <OddSign>2</OddSign>
                  </Inner>
                  <Inner>
                      <ScoreTimer minute={90} isFulltime={true} />
                      
            <OddSign>1</OddSign>
            <OddSign>X</OddSign>
            <OddSign>2</OddSign>
                  </Inner>
                  
                  <ScoreInfo>
                      <Inner>
                          <TeamBlock>
                              <Badge src='https://img.sofascore.com/api/v1/team/42/image' width={18} height={18} alt='badge' />
                          <TeamText>Arsenal</TeamText>
                          </TeamBlock>
                          <Odd>1.85</Odd>
                          <Odd>3.50</Odd>
                          <Odd>4.20</Odd>
                      </Inner>
                      <Inner>
                          <TeamBlock>
                              <Badge src='https://img.sofascore.com/api/v1/team/3001/image' width={18} height={18} alt='badge' />
                          <TeamText>Sporting</TeamText>
                          </TeamBlock>
                          <Odd>3.85</Odd>
                          <Odd>0.50</Odd>
                          <Odd>1.20</Odd>
                      </Inner>
                  </ScoreInfo>
        </Bottom>
      </Content>
    </Component>
  );
};

export default OddScoreItem;