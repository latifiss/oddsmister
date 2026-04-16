'use client'

import React, { useEffect, useRef, useMemo, useState } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface GoalMarket {
  line: number
  overProbability: number
  underProbability: number
}

interface OverUnderGoalsProbabilityProps {
  data?: GoalMarket[]
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
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
  gap: 20px;
  margin-top: 8px;
  flex-wrap: wrap;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const LegendColor = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`

const LegendText = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #666;
  font-family: inherit;
`

const TeamHeader = styled.div`
  display: flex;
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

const MarketSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: -16px;
  flex-wrap: wrap;
`

const MarketButton = styled.button<{ $active: boolean; $color: string }>`
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid ${({ $active, $color }) => $active ? $color : '#ddd'};
  background: ${({ $active, $color }) => $active ? `${$color}15` : 'transparent'};
  color: ${({ $active, $color }) => $active ? $color : '#666'};
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ $color }) => $color};
    background: ${({ $color }) => `${$color}10`};
  }
`

function generateDefaultData(): GoalMarket[] {
  return [
    { line: 0.5, overProbability: 72, underProbability: 28 },
    { line: 1.5, overProbability: 58, underProbability: 42 },
    { line: 2.5, overProbability: 45, underProbability: 55 },
    { line: 3.5, overProbability: 31, underProbability: 69 },
    { line: 4.5, overProbability: 18, underProbability: 82 },
    { line: 5.5, overProbability: 9, underProbability: 91 },
  ]
}

const OverUnderGoalsProbability: React.FC<OverUnderGoalsProbabilityProps> = ({
  data,
  homeTeam = 'Home Team',
  awayTeam = 'Away Team',
  homeBadge,
  awayBadge,
  width = 500,
  height = 500,
  title = 'Over / Under Goals',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const resolvedData = useMemo(() => data ?? generateDefaultData(), [data])
  const [selectedMarket, setSelectedMarket] = useState<GoalMarket>(resolvedData[2])
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  const size = Math.min(width, height) * 0.7
  const centerX = width / 2
  const centerY = height / 2 - 20
  const radius = size / 2

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const defs = svg.append('defs')

    const underGrad = defs.append('linearGradient')
      .attr('id', 'underGrad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%')
    
    underGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fc8d59').attr('stop-opacity', 0.9)
    underGrad.append('stop').attr('offset', '100%').attr('stop-color', '#f4a261').attr('stop-opacity', 0.7)

    const overGrad = defs.append('linearGradient')
      .attr('id', 'overGrad')
      .attr('x1', '100%').attr('y1', '100%')
      .attr('x2', '0%').attr('y2', '0%')
    
    overGrad.append('stop').attr('offset', '0%').attr('stop-color', '#2db84b').attr('stop-opacity', 0.9)
    overGrad.append('stop').attr('offset', '100%').attr('stop-color', '#69db7e').attr('stop-opacity', 0.7)

    const bgGrad = defs.append('radialGradient')
      .attr('id', 'bgGrad')
      .attr('cx', '50%').attr('cy', '50%')
      .attr('r', '50%')
    
    bgGrad.append('stop').attr('offset', '0%').attr('stop-color', '#f8f9fa')
    bgGrad.append('stop').attr('offset', '100%').attr('stop-color', '#f0f2f5')

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius + 8)
      .attr('fill', 'url(#bgGrad)')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1)

    const underArc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle((selectedMarket.underProbability / 100) * 2 * Math.PI)

    const overArc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius)
      .startAngle((selectedMarket.underProbability / 100) * 2 * Math.PI)
      .endAngle(2 * Math.PI)

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', underArc() as string)
      .attr('fill', 'url(#underGrad)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseenter', () => setHoveredValue(selectedMarket.underProbability))
      .on('mouseleave', () => setHoveredValue(null))

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', overArc() as string)
      .attr('fill', 'url(#overGrad)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseenter', () => setHoveredValue(selectedMarket.overProbability))
      .on('mouseleave', () => setHoveredValue(null))

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius * 0.42)
      .attr('fill', '#fff')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1)

    const displayValue = hoveredValue !== null ? hoveredValue : selectedMarket.overProbability
    const displayLabel = hoveredValue !== null ? (hoveredValue === selectedMarket.underProbability ? 'UNDER' : 'OVER') : 'OVER'

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '28px')
      .style('fill', hoveredValue !== null ? (hoveredValue === selectedMarket.underProbability ? '#fc8d59' : '#2db84b') : '#2db84b')
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(`${Math.round(displayValue)}%`)

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 16)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .style('font-weight', '600')
      .style('letter-spacing', '1px')
      .text(displayLabel)

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 32)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(`Over ${selectedMarket.line} Goals`)

    const tickRadius = radius + 12
    for (let i = 0; i <= 10; i++) {
      const angle = (i / 10) * 2 * Math.PI - Math.PI / 2
      const x1 = centerX + (radius - 5) * Math.cos(angle)
      const y1 = centerY + (radius - 5) * Math.sin(angle)
      const x2 = centerX + (radius + 5) * Math.cos(angle)
      const y2 = centerY + (radius + 5) * Math.sin(angle)

      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
    }

  }, [selectedMarket, centerX, centerY, radius, hoveredValue])

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>Probability distribution for total goals markets</Subtitle>
      
      <TeamHeader>
        {homeBadge && <TeamBadge src={homeBadge} alt={homeTeam} />}
        <TeamName>{homeTeam}</TeamName>
        <span style={{ margin: '0 8px', color: '#ccc' }}>vs</span>
        <TeamName>{awayTeam}</TeamName>
        {awayBadge && <TeamBadge src={awayBadge} alt={awayTeam} />}
      </TeamHeader>

      <MarketSelector>
        {resolvedData.map((market, idx) => (
          <MarketButton
            key={idx}
            $active={selectedMarket.line === market.line}
            $color={market.overProbability > 50 ? '#2db84b' : '#fc8d59'}
            onClick={() => setSelectedMarket(market)}
          >
            Over {market.line}
          </MarketButton>
        ))}
      </MarketSelector>

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
          <LegendColor $color="#fc8d59" />
          <LegendText>Under</LegendText>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#2db84b" />
          <LegendText>Over</LegendText>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#ddd" />
          <LegendText>Hover any section</LegendText>
        </LegendItem>
      </Legend>
    </Wrapper>
  )
}

export default OverUnderGoalsProbability