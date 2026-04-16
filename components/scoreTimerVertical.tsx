'use client'

import React from 'react'
import styled from 'styled-components'

interface ScoreTimerVerticalProps {
  minute: number         
  maxMinute?: number      
  isHalftime?: boolean    
  isFulltime?: boolean    
}

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  gap: 6px;
`

const ProgressBar = styled.div<{ $progress: number; $isHalftime?: boolean; $isFulltime?: boolean }>`
  position: relative;
  width: 36px;
  height: 6px;
  background: ${({ $isHalftime, $isFulltime }) => 
    $isHalftime ? '#FFD7D7' : $isFulltime ? '#E0E0E0' : '#FFD7D7'};
  overflow: hidden;
  clip-path: polygon(2px 0%, 100% 0%, calc(100% - 2px) 100%, 0% 100%);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ $progress }) => $progress}%;
    height: 100%;
    background: ${({ $isHalftime, $isFulltime, theme }) => 
      $isFulltime ? '#999' : $isHalftime ? '#FFA500' : theme.colors.hot};
    transform-origin: top left;
    transform: skewX(-15deg);
    transition: width 0.4s ease;
  }
`;

const MinuteLabel = styled.div<{ $isHalftime?: boolean; $isFulltime?: boolean }>`
  padding: 0 8px 0 6px;
  font-size: 12px;
  font-weight: 800;
  font-style: italic;
  color: ${({ $isHalftime, $isFulltime, theme }) => 
    $isFulltime ? '#999' : $isHalftime ? '#FFA500' : theme.colors.hot};
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1;
`

const ScoreTimerVertical: React.FC<ScoreTimerVerticalProps> = ({ 
  minute, 
  maxMinute = 90,
  isHalftime = false,
  isFulltime = false 
}) => {
  let displayMinute = minute
  let progress = 0
  
  if (isFulltime) {
    displayMinute = 90
    progress = 100
  } else if (isHalftime) {
    displayMinute = 45
    progress = 50
  } else {
    const clamped = Math.min(Math.max(minute, 0), maxMinute)
    progress = Math.round((clamped / maxMinute) * 100)
    displayMinute = clamped
  }
  
  let displayText = `${displayMinute}'`
  if (minute > 90 && !isFulltime) {
    const extraTime = minute - 90
    displayText = `90+${extraTime}'`
    progress = 100 
  }
  
  if (isHalftime) {
    displayText = "HT"
  }
  
  if (isFulltime) {
    displayText = "FT"
  }

  return (
    <Wrapper>
      <ProgressBar $progress={progress} $isHalftime={isHalftime} $isFulltime={isFulltime} />
      <MinuteLabel $isHalftime={isHalftime} $isFulltime={isFulltime}>
        {displayText}
      </MinuteLabel>
    </Wrapper>
  )
}

export default ScoreTimerVertical