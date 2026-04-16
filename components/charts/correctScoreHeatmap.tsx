'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface ScoreProbability {
  home: number
  away: number
  probability: number
}

interface CorrectScoreHeatmapProps {
  data?: ScoreProbability[]
  homeTeam?: string
  awayTeam?: string
  homeBadge?: string
  awayBadge?: string
  width?: number
  height?: number
  title?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px 10px;
  border-radius: 14px;
  font-family: inherit;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
`

const ChartArea = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-x: auto;

  svg {
    display: block;
    overflow: visible;
    max-width: 100%;
    height: auto;
  }

  svg text {
    font-family: inherit;
  }
`

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
  font-family: inherit;
`

const Subtitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #666;
  text-align: center;
  margin-bottom: 12px;
  font-family: inherit;
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
  flex-wrap: wrap;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`

const LegendText = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #666;
  font-family: inherit;
`

const TeamHeader = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`

const TeamBadge = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`

const TeamName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #333;
  font-family: inherit;
`

function generateDefaultData(): ScoreProbability[] {
  const scores = [
    { home: 0, away: 0 }, { home: 1, away: 0 }, { home: 0, away: 1 },
    { home: 1, away: 1 }, { home: 2, away: 0 }, { home: 0, away: 2 },
    { home: 2, away: 1 }, { home: 1, away: 2 }, { home: 2, away: 2 },
    { home: 3, away: 0 }, { home: 0, away: 3 }, { home: 3, away: 1 },
    { home: 1, away: 3 }, { home: 3, away: 2 }, { home: 2, away: 3 },
    { home: 3, away: 3 }, { home: 4, away: 0 }, { home: 0, away: 4 },
    { home: 4, away: 1 }, { home: 1, away: 4 }, { home: 4, away: 2 },
    { home: 2, away: 4 }, { home: 4, away: 3 }, { home: 3, away: 4 },
    { home: 4, away: 4 }
  ]
  
  return scores.map(score => ({
    home: score.home,
    away: score.away,
    probability: Math.random() * 12
  })).sort((a, b) => b.probability - a.probability)
}

const CorrectScoreHeatmap: React.FC<CorrectScoreHeatmapProps> = ({
  data,
  homeTeam = 'Home Team',
  awayTeam = 'Away Team',
  homeBadge,
  awayBadge,
  width = 500,
  height = 500,
  title = 'Correct Score Probability',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const resolvedData = useMemo(() => data ?? generateDefaultData(), [data])

  const margin = { top: 60, right: 30, bottom: 50, left: 50 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const maxHomeScore = Math.max(...resolvedData.map(d => d.home))
  const maxAwayScore = Math.max(...resolvedData.map(d => d.away))
  
  const homeScores = Array.from(new Set(resolvedData.map(d => d.home))).sort((a, b) => a - b)
  const awayScores = Array.from(new Set(resolvedData.map(d => d.away))).sort((a, b) => a - b)

  const getProbability = (home: number, away: number) => {
    const found = resolvedData.find(d => d.home === home && d.away === away)
    return found ? found.probability : 0
  }

  const maxProbability = Math.max(...resolvedData.map(d => d.probability))

  const getColor = (probability: number) => {
    const intensity = probability / maxProbability
    if (intensity > 0.8) return '#d73027'
    if (intensity > 0.6) return '#fc8d59'
    if (intensity > 0.4) return '#fee090'
    if (intensity > 0.2) return '#ffffbf'
    return '#e0f3f8'
  }

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleBand()
      .domain(homeScores.map(String))
      .range([0, innerW])
      .padding(0.05)

    const yScale = d3.scaleBand()
      .domain(awayScores.map(String))
      .range([0, innerH])
      .padding(0.05)

    homeScores.forEach(home => {
      awayScores.forEach(away => {
        const prob = getProbability(home, away)
        const color = getColor(prob)
        
        g.append('rect')
          .attr('x', xScale(String(home)) || 0)
          .attr('y', yScale(String(away)) || 0)
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .attr('fill', color)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .attr('rx', 2)

        if (prob > 0) {
          g.append('text')
            .attr('x', (xScale(String(home)) || 0) + xScale.bandwidth() / 2)
            .attr('y', (yScale(String(away)) || 0) + yScale.bandwidth() / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', prob > maxProbability * 0.4 ? '10px' : '9px')
            .style('fill', prob > maxProbability * 0.6 ? '#fff' : '#333')
            .style('font-family', 'inherit')
            .style('font-weight', '600')
            .text(`${prob.toFixed(1)}%`)
        }
      })
    })

    g.append('g')
      .attr('transform', `translate(0, ${innerH})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d))
      .style('font-size', '10px')
      .style('fill', '#6666660')
      .style('font-family', 'inherit')
      .call(g => g.select('.domain').attr('stroke', 'none'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'none'))

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => d))
      .style('font-size', '10px')
      .style('fill', '#6666660')
      .style('font-family', 'inherit')
      .call(g => g.select('.domain').attr('stroke', 'none'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'none'))

    g.append('text')
      .attr('x', innerW / 2)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text('HOME GOALS →')

    g.append('text')
      .attr('x', -35)
      .attr('y', innerH / 2)
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90, -35, ${innerH / 2})`)
      .style('font-size', '11px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text('AWAY GOALS →')

  }, [resolvedData, innerW, innerH, homeScores, awayScores])

  const highestProb = Math.max(...resolvedData.map(d => d.probability))
  const lowestProb = Math.min(...resolvedData.map(d => d.probability).filter(p => p > 0))

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>Most likely score outcomes based on statistical models</Subtitle>
      
      <TeamHeader>
        {homeBadge && <TeamBadge src={homeBadge} alt={homeTeam} />}
        <TeamName>{homeTeam}</TeamName>
        <span style={{ margin: '0 8px', color: '#ccc' }}>vs</span>
        <TeamName>{awayTeam}</TeamName>
        {awayBadge && <TeamBadge src={awayBadge} alt={awayTeam} />}
      </TeamHeader>

      <ChartArea>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </ChartArea>

      <Legend>
        <LegendItem>
          <LegendColor $color="#e0f3f8" />
          <LegendText>Low</LegendText>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#ffffbf" />
          <LegendText />
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#fee090" />
          <LegendText />
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#fc8d59" />
          <LegendText />
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#d73027" />
          <LegendText>High</LegendText>
        </LegendItem>
      </Legend>
    </Wrapper>
  )
}

export default CorrectScoreHeatmap