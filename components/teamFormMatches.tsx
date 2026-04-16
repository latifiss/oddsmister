'use client'

import React from 'react'
import styled from 'styled-components'
import FormScoreItem from '@/components/formScore'
import { homeTeamForm } from '@/data/matches'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  width: 100%;
`

const NewsTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.heavyMetal};
  font-family: inherit;
`

const ScoresWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
`

const TeamFormMatches = () => {
  return (
    <PageWrapper>
      <NewsTitle>Home Team Form Scores</NewsTitle>
      <ScoresWrapper>
        {homeTeamForm.map((item, index) => (
          <FormScoreItem
            key={index}
            homeTeam={item.team}
            awayTeam="Opponent"
            homeImage={item.image}
            awayImage="https://img.sofascore.com/api/v1/team/35/image"
            homeScore={item.score}
            awayScore="1"
            result={item.result} 
          />
        ))}
      </ScoresWrapper>
    </PageWrapper>
  )
}

export default TeamFormMatches
