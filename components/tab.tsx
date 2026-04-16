'use client'

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const Alink = styled(Link)`
  text-decoration: none;
`;

const TabText = styled.p<{ $isActive: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.text};
  font-family: inherit, sans-serif;
  text-decoration: none;
  margin-left: 6px;
  margin-top: 0;
  white-space: nowrap;

  @media (max-width: 576px) {
    font-size: 12px;
    margin-left: 4px;
  }
`;

const IconButton = styled.button`
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const TabComponent = styled.div<{ $isActive: boolean; $tabType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px 0 8px;
  height: 40px;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.dust : theme.colors.background};
  border-radius: 99px;
  transition: background-color 0.3s ease;
  gap: 4px;

  &:hover {
    background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.altBg : 'transparent'};
  }

  @media (max-width: 576px) {
    padding: 0 8px 0 6px;
    height: 34px;
    gap: 3px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 576px) {
    width: 20px;
    height: 20px;
  }
`;

interface TabProps {
  label: string;
  isActive: boolean;
  href: string;
  TabImage: string;
}

const Tab = ({ label, isActive, href, TabImage }: TabProps) => {
  return (
    <Alink href={href} passHref>
      <TabComponent $isActive={isActive} $tabType={label}>
        <ImageWrapper>
          <Image 
            src={TabImage} 
            alt={label} 
            width={24} 
            height={24} 
            style={{ objectFit: 'contain' }}
          />
        </ImageWrapper>
        <TabText $isActive={isActive}>{label}</TabText>
      </TabComponent>
    </Alink>
  )
}

export default Tab