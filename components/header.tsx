'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import styled from 'styled-components';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/themeSlice";
import { RootState } from "@/store";
import { LuMoon, LuSun, LuMenu } from "react-icons/lu";

const HeadWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 16px;
  width: 100%;
`;

const AdContainer = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 2px;
  padding: 0 12px;
`;

const InfoIcon = styled(IoInformationCircleOutline)`
  width: 12px;
  height: 12px;
  color: ${({ theme }) => theme.colors.grayText};
`;

const AdLabel = styled.p`
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.grayText};
`;

const InsideAdWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 12px 12px;

  @media (max-width: 768px) {
    padding: 12px 8px;
  }
`;

const AdWrapper = styled.div`
  width: 100%;
  height: 250px;
  background-color: ${({ theme }) => theme.colors.adBg};
  margin-bottom: 12px;
`;

const Component = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.base};
  padding: 8px 0 0 0;
  width: 100%;

  @media (max-width: 768px) {
    align-items: center;
    padding: 0 16px;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0px 30px;

  @media (max-width: 576px) {
    padding: 0px 16px;
  }

  @media (min-width: 577px) and (max-width: 768px) {
    padding: 0px 16px;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Logo = styled(Image)`
  height: 55px;
  width: auto;
  object-fit: contain;

  @media (max-width: 576px) {
    height: 35px;
  }

  @media (min-width: 577px) and (max-width: 768px) {
    height: 45px;
  }
`;

const OtherSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 20px;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;

  @media only screen and (max-width: 576px) {
    justify-content: flex-start;
    padding: 8px 8px;
  }

  @media only screen and (min-width: 577px) and (max-width: 768px) {
    justify-content: flex-start;
    padding: 8px 16px;
  }
`;

const TabComponent = styled.div<{ $isActive: boolean; $tabType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  height: 32px;
  cursor: pointer;
  text-decoration: none;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.dust : theme.colors.deep};
  border: 1px solid ${({ $isActive, theme }) =>
    $isActive ? theme.colors.dust : theme.colors.stroke};
  border-radius: 99px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.altBg : 'transparent'};
  }

  @media (max-width: 576px) {
    padding: 0 6px;
    height: 40px;
  }
`;

const Alink = styled(Link)`
  text-decoration: none;
`;

const TabText = styled.p<{ $isActive: boolean }>`
  font-size: 15px;
  font-weight: 500;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.text};
  font-family: inherit;
  text-decoration: none;
  margin-left: 3px;
  margin-top: 4px;
  white-space: nowrap;
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

const MoonIcon = styled(LuMoon)`
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.grayText};
`;

const SunIcon = styled(LuSun)`
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.grayText};
`;

const ThemeToggle = () => {
  const themeMode = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <IconButton onClick={() => dispatch(toggleTheme())}>
      {themeMode === "light" ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
};

const MenuIcon = styled(LuMenu)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

interface TabProps {
  label: string;
  isActive: boolean;
  href: string;
  TabImage: string;
}

const Tab = ({ label, isActive, href, TabImage }: TabProps) => (
  <Alink href={href} passHref>
    <TabComponent $isActive={isActive} $tabType={label}>
      <Image src={TabImage} alt={label} width={18} height={18} />
      <TabText $isActive={isActive}>{label}</TabText>
    </TabComponent>
  </Alink>
);

const Header = () => {
  const themeMode = useSelector((state: RootState) => state.theme.theme);
  
  // Determine which logo to use based on theme
  const logoSrc = themeMode === "light" 
    ? "assets/logo/oi-logo.svg" 
    : "assets/logo/oi-logo.svg";

  return (
    <HeadWrapper>
      <AdContainer>
        <LabelContainer>
          <InfoIcon />
          <AdLabel>Advertisement</AdLabel>
        </LabelContainer>
        <InsideAdWrapper>
          <AdWrapper />
        </InsideAdWrapper>
      </AdContainer>

      <Component>
        <TopRow>
          <LogoLink href="/">
            <Logo 
              src={logoSrc} 
              alt="logo" 
              width={322} 
              height={55} 
              priority
            />
          </LogoLink>
          <ThemeToggle />
        </TopRow>
      </Component>
    </HeadWrapper>
  );
};

export default Header;