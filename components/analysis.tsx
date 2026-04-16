'use client'

import React from 'react'
import styled from 'styled-components'
import CircularBarplot from './charts/circularPlot'
import PossessionClock from './charts/possessionClock'
import MatchMomentumChart from './charts/momentum'
import CorrectScoreHeatmap from './charts/correctScoreHeatmap'
import WaterfallChart from './charts/waterfall'
import { probData, scoreData } from '@/data/scoreProb'
import OverUnderGoalsProbability from './charts/overUnderGoalsProbability'
import WinProbabilityMeter from './charts/winProbabilityMeter'
import DualGaugeChart from './charts/dualGuage'
import GoalTimingChart from './charts/goalTiming'
import { comparisonData } from '@/data/comparison'
import MatchComparison from './charts/teamComparison'
import OddHistoryMultiple from './charts/oddsHistoryMultiple'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0px 0px 60px 0px;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 12px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
`

const goalData = [
  { interval: '0-5\'', goals: 23 },
  { interval: '6-15\'', goals: 82 },
  { interval: '16-30\'', goals: 18 },
  { interval: '31-45\'', goals: 45 },
  { interval: '45+\'', goals: 12 },
  { interval: '46-60\'', goals: 67 },
  { interval: '61-75\'', goals: 34 },
  { interval: '76-90\'', goals: 56 },
  { interval: '90+\'', goals: 28 },
]

const Analysis = () => {
  return (
      <Wrapper>
          <Content>
          
                        <MatchComparison 
                  data={comparisonData}
                  homeTeam="Arsenal"
                  awayTeam="Chelsea"
                  homeColor="#ef0107"
                  awayColor="#034694"
                  width={700}
                  height={450}
                  title="Arsenal vs Chelsea - Match Analysis"
                />
          <GoalTimingChart 
            data={goalData}
                    teamName="Manchester City"
            color="#1c7c4c"
            title="Goal Timing Analysis"
                  />
                        <DualGaugeChart 
                  overProbability={62}
                  underProbability={38}
                  homeTeam="Arsenal"
                  awayTeam="Chelsea"
                  homeColor="#ef0107"
                  awayColor="#034694"
                  title="Arsenal vs Chelsea - Goal Line"
          />
          <Container>
                  <WinProbabilityMeter 
            homeProbability={58}
            awayProbability={25}
            drawProbability={17}
            homeTeam="Arsenal"
            awayTeam="Chelsea"
            homeColor="#ef0107"
            awayColor="#034694"
            homeBadge="https://img.sofascore.com/api/v1/team/42/image"
            awayBadge="https://img.sofascore.com/api/v1/team/43/image"
              />
              </Container>
                  <OverUnderGoalsProbability 
            data={probData}
            homeTeam="Arsenal"
            awayTeam="Chelsea"
            homeBadge="https://img.sofascore.com/api/v1/team/42/image"
            awayBadge="https://img.sofascore.com/api/v1/team/43/image"
              />
              </Content>
    </Wrapper>
  )
}

export default Analysis