'use client'

import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface GoalLineProbabilityProps {
  overProbability: number
  underProbability: number
  homeTeam?: string
  awayTeam?: string
  homeColor?: string
  awayColor?: string
  width?: number
  height?: number
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  width: 100%;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
`

const ValueDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
`

const ValueCard = styled.div<{ $color: string }>`
  text-align: center;
  flex: 1;
  padding: 12px;
  background: ${({ $color }) => `${$color}10`};
  border-radius: 12px;
  margin: 0 8px;
`

const ValueLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
`

const ValuePercent = styled.div<{ $color: string }>`
  font-size: 28px;
  font-weight: 800;
  color: ${({ $color }) => $color};
`

const GoalLineProbability: React.FC<GoalLineProbabilityProps> = ({
  overProbability = 50,
  underProbability = 50,
  homeTeam = 'Home',
  awayTeam = 'Away',
  homeColor = '#fc8d59',
  awayColor = '#d73027',
  width = 500,
  height = 350,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredValue, setHoveredValue] = useState<string | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const centerX = width / 2
    const centerY = height / 2 + 20
    const radius = Math.min(width, height) * 0.28

    const underArc = d3.arc()
      .innerRadius(radius - 40)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (underProbability / 100) * Math.PI)

    const overArc = d3.arc()
      .innerRadius(radius - 40)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (overProbability / 100) * Math.PI)

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', underArc() as string)
      .attr('fill', homeColor)
      .attr('cursor', 'pointer')
      .on('mouseenter', () => setHoveredValue(`Under 2.5: ${underProbability}%`))
      .on('mouseleave', () => setHoveredValue(null))

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', overArc() as string)
      .attr('fill', awayColor)
      .attr('cursor', 'pointer')
      .on('mouseenter', () => setHoveredValue(`Over 2.5: ${overProbability}%`))
      .on('mouseleave', () => setHoveredValue(null))

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius - 42)
      .attr('fill', '#fff')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1)

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#999')
      .style('font-weight', '500')
      .text('TOTAL GOALS')

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '22px')
      .style('fill', awayColor)
      .style('font-weight', 'bold')
      .text('2.5')

    const tickValues = [0, 25, 50, 75, 100]
    tickValues.forEach(value => {
      const angle = -Math.PI / 2 + (value / 100) * Math.PI
      const tickLength = value === 50 ? 10 : 6
      const x1 = centerX + (radius + 5) * Math.cos(angle)
      const y1 = centerY + (radius + 5) * Math.sin(angle)
      const x2 = centerX + (radius + 5 + tickLength) * Math.cos(angle)
      const y2 = centerY + (radius + 5 + tickLength) * Math.sin(angle)

      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1.5)

      if (value !== 50) {
        const labelRadius = radius + 20
        const labelX = centerX + labelRadius * Math.cos(angle)
        const labelY = centerY + labelRadius * Math.sin(angle)
        
        svg.append('text')
          .attr('x', labelX)
          .attr('y', labelY)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .style('font-size', '9px')
          .style('fill', '#999')
          .text(`${value}%`)
      }
    })

  }, [overProbability, underProbability, width, height, homeColor, awayColor])

  return (
    <Wrapper>
      <Title>Over / Under 2.5 Goals Probability</Title>
      
      {hoveredValue && (
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
          {hoveredValue}
        </div>
      )}
      
      <svg ref={svgRef} width={width} height={height} />
      
      <ValueDisplay>
        <ValueCard $color={homeColor}>
          <ValueLabel>UNDER 2.5 GOALS</ValueLabel>
          <ValuePercent $color={homeColor}>{underProbability}%</ValuePercent>
        </ValueCard>
        <ValueCard $color={awayColor}>
          <ValueLabel>OVER 2.5 GOALS</ValueLabel>
          <ValuePercent $color={awayColor}>{overProbability}%</ValuePercent>
        </ValueCard>
      </ValueDisplay>
    </Wrapper>
  )
}

export default GoalLineProbability