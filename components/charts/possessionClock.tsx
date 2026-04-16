'use client'

import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

/* ===== Types ===== */
interface PossessionClockProps {
  homePercentage?: number
  awayPercentage?: number
  homeTeam?: string
  awayTeam?: string
  homeColor?: string
  awayColor?: string
  width?: number
  height?: number
  isLive?: boolean
  minute?: number
}

/* ===== Styled Components ===== */
const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px 10px;
  border-radius: 14px;
  font-family: inherit;
  background: ${({ theme }) => theme.colors?.white || '#fff'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const ChartArea = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    display: block;
    overflow: visible;
  }

  svg text {
    font-family: inherit;
  }
`

const LegendContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 8px;
`

const LegendItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`

const LegendText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #555;
  font-family: inherit;
`

const LegendValue = styled.span<{ $color: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  font-family: inherit;
  margin-left: auto;
`

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
`

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f80000;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`

const LiveText = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #f80000;
  text-transform: uppercase;
  font-family: inherit;
`

const MinuteText = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #999;
  font-family: inherit;
`

/* ===== Component ===== */
const PossessionClock: React.FC<PossessionClockProps> = ({
  homePercentage = 58,
  awayPercentage = 42,
  homeTeam = 'Home Team',
  awayTeam = 'Away Team',
  homeColor = '#2db84b',
  awayColor = '#f5a623',
  width = 280,
  height = 280,
  isLive = false,
  minute = 67,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // Ensure percentages add to 100
  const homeValue = Math.min(Math.max(homePercentage, 0), 100)
  const awayValue = Math.min(Math.max(awayPercentage, 0), 100 - homeValue)
  const actualHome = homeValue
  const actualAway = 100 - actualHome

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const size = Math.min(width, height)
    const centerX = width / 2
    const centerY = height / 2
    const radius = size * 0.35
    const innerRadius = radius * 0.65

    // Create gradient for home side
    const defs = svg.append('defs')
    
    const homeGrad = defs.append('linearGradient')
      .attr('id', 'homeGrad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%')
    
    homeGrad.append('stop').attr('offset', '0%').attr('stop-color', homeColor).attr('stop-opacity', 0.9)
    homeGrad.append('stop').attr('offset', '100%').attr('stop-color', homeColor).attr('stop-opacity', 0.7)

    const awayGrad = defs.append('linearGradient')
      .attr('id', 'awayGrad')
      .attr('x1', '100%').attr('y1', '100%')
      .attr('x2', '0%').attr('y2', '0%')
    
    awayGrad.append('stop').attr('offset', '0%').attr('stop-color', awayColor).attr('stop-opacity', 0.9)
    awayGrad.append('stop').attr('offset', '100%').attr('stop-color', awayColor).attr('stop-opacity', 0.7)

    // Background circle (base)
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 2)

    // Calculate angles (pie chart)
    const homeAngle = (actualHome / 100) * 360
    const awayAngle = 360 - homeAngle

    // Create pie generator
    const pie = d3.pie<number>()
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .sort(null)
      .value(d => d)

    const data = [actualHome, actualAway]
    const arcs = pie(data)

    // Arc generator
    const arc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4)

    // Colors for pie slices
    const colors = [`url(#homeGrad)`, `url(#awayGrad)`]

    // Draw pie slices
    svg.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', d => arc(d) || '')
      .attr('fill', (d, i) => colors[i])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.95)

    // Add inner circle (center)
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', innerRadius - 4)
      .attr('fill', '#fff')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1.5)

    // Add center text (possession label)
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text('POSSESSION')

    // Add home percentage in center
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 12)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .style('fill', homeColor)
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(`${Math.round(actualHome)}%`)

    // Add small tick marks around the clock (every 10%)
    for (let i = 0; i <= 10; i++) {
      const angle = (i / 10) * 2 * Math.PI - Math.PI / 2
      const innerTickRadius = radius + 5
      const outerTickRadius = radius + 10
      
      const x1 = centerX + innerTickRadius * Math.cos(angle)
      const y1 = centerY + innerTickRadius * Math.sin(angle)
      const x2 = centerX + outerTickRadius * Math.cos(angle)
      const y2 = centerY + outerTickRadius * Math.sin(angle)
      
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1.5)
      
      // Add percentage labels at ticks
      const labelRadius = radius + 18
      const labelX = centerX + labelRadius * Math.cos(angle)
      const labelY = centerY + labelRadius * Math.sin(angle)
      const percentValue = i * 10
      
      svg.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '8px')
        .style('fill', '#aaa')
        .style('font-family', 'inherit')
        .text(`${percentValue}%`)
    }

    // Add direction arrow (small indicator showing which team has more possession)
    if (actualHome > 50) {
      // Arrow pointing clockwise (home dominance)
      const arrowAngle = -Math.PI / 4
      const arrowRadius = radius - 12
      const arrowX = centerX + arrowRadius * Math.cos(arrowAngle)
      const arrowY = centerY + arrowRadius * Math.sin(arrowAngle)
      
      svg.append('text')
        .attr('x', arrowX)
        .attr('y', arrowY)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', homeColor)
        .text('→')
    } else if (actualAway > 50) {
      // Arrow pointing counter-clockwise (away dominance)
      const arrowAngle = Math.PI / 4
      const arrowRadius = radius - 12
      const arrowX = centerX + arrowRadius * Math.cos(arrowAngle)
      const arrowY = centerY + arrowRadius * Math.sin(arrowAngle)
      
      svg.append('text')
        .attr('x', arrowX)
        .attr('y', arrowY)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', awayColor)
        .text('←')
    }

  }, [width, height, actualHome, actualAway, homeColor, awayColor])

  return (
    <Wrapper>
      <ChartArea>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        />
      </ChartArea>

      <LegendContainer>
        <LegendItem $color={homeColor}>
          <LegendColor $color={homeColor} />
          <LegendText>{homeTeam}</LegendText>
          <LegendValue $color={homeColor}>{Math.round(actualHome)}%</LegendValue>
        </LegendItem>
        <LegendItem $color={awayColor}>
          <LegendColor $color={awayColor} />
          <LegendText>{awayTeam}</LegendText>
          <LegendValue $color={awayColor}>{Math.round(actualAway)}%</LegendValue>
        </LegendItem>
      </LegendContainer>

      {isLive && (
        <LiveIndicator>
          <LiveDot />
          <LiveText>LIVE</LiveText>
          <MinuteText>{minute}'</MinuteText>
        </LiveIndicator>
      )}
    </Wrapper>
  )
}

export default PossessionClock