'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  padding: 0;
`;

const NavButtonLeft = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-top-left-radius: 99px;
  border-bottom-left-radius: 99px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;
`;

const NavButtonRight = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-top-right-radius: 99px;
  border-bottom-right-radius: 99px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;
`;

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 10px 16px;
  height: 36px;
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

interface DaySelectorProps {
  onDayChange?: (date: Date) => void;
  selectedDate?: Date;
}

const DaySelector: React.FC<DaySelectorProps> = ({ onDayChange, selectedDate }) => {
  const [selectedDay, setSelectedDay] = useState<Date>(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setSelectedDay(selectedDate);
    }
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDay);
    newDate.setDate(selectedDay.getDate() - 1);
    setSelectedDay(newDate);
    onDayChange?.(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDay);
    newDate.setDate(selectedDay.getDate() + 1);
    setSelectedDay(newDate);
    onDayChange?.(newDate);
  };

  return (
    <Container>
      <NavButtonLeft onClick={goToPreviousDay}>
        <IoChevronBack size={18} />
      </NavButtonLeft>
      <DateDisplay>
        {formatDate(selectedDay)}
      </DateDisplay>
      <NavButtonRight onClick={goToNextDay}>
        <IoChevronForward size={18} />
      </NavButtonRight>
    </Container>
  );
};

export default DaySelector;