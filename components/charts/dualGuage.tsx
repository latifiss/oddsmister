'use client'

import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface DualGaugeChartProps {
  overProbability?: number
  underProbability?: number
  homeTeam?: string
  awayTeam?: string
  homeColor?: string
  awayColor?: string
  width?: number
  height?: number
  title?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 8px;
  font-family: inherit;
`

const Subtitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #666;
  text-align: center;
  margin-bottom: 16px;
  font-family: inherit;
`

const GaugeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
`

const GaugeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const GaugeLabel = styled.div<{ $color: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-align: center;
`

const GaugeValue = styled.div<{ $color: string }>`
  font-size: 24px;
  font-weight: 800;
  color: ${({ $color }) => $color};
  text-align: center;
`

const GaugeSubLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: #666;
  text-align: center;
`

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-x: auto;
`

const DualGaugeChart: React.FC<DualGaugeChartProps> = ({
  overProbability = 45,
  underProbability = 55,
  homeTeam = 'Home Team',
  awayTeam = 'Away Team',
  homeColor = '#fc8d59',
  awayColor = '#d73027',
  width = 500,
  height = 300,
  title = 'Over / Under 2.5 Goals',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const centerX = width / 2
    const centerY = height - 60
    const radius = 90

    const underAngle = (underProbability / 100) * Math.PI
    const overAngle = (overProbability / 100) * Math.PI

    // Under gauge (left)
    const underArc = d3.arc()
      .innerRadius(radius - 25)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + underAngle)

    // Over gauge (right)
    const overArc = d3.arc()
      .innerRadius(radius - 25)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + overAngle)

    // Background arcs
    const backgroundArc = d3.arc()
      .innerRadius(radius - 25)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)

    // Left gauge background
    svg.append('path')
      .attr('transform', `translate(${centerX - 130}, ${centerY})`)
      .attr('d', backgroundArc() as string)
      .attr('fill', '#f0f0f0')

    // Left gauge fill
    svg.append('path')
      .attr('transform', `translate(${centerX - 130}, ${centerY})`)
      .attr('d', underArc() as string)
      .attr('fill', homeColor)
      .attr('opacity', 0.9)

    // Left gauge center circle
    svg.append('circle')
      .attr('cx', centerX - 130)
      .attr('cy', centerY)
      .attr('r', radius - 28)
      .attr('fill', '#fff')
      .attr('stroke', homeColor)
      .attr('stroke-width', 2)

    // Left gauge percentage text
    svg.append('text')
      .attr('x', centerX - 130)
      .attr('y', centerY + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', homeColor)
      .style('font-family', 'inherit')
      .text(`${underProbability}%`)

    // Left gauge label
    svg.append('text')
      .attr('x', centerX - 130)
      .attr('y', centerY - 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .text('UNDER 2.5')

    // Right gauge background
    svg.append('path')
      .attr('transform', `translate(${centerX + 130}, ${centerY})`)
      .attr('d', backgroundArc() as string)
      .attr('fill', '#f0f0f0')

    // Right gauge fill
    svg.append('path')
      .attr('transform', `translate(${centerX + 130}, ${centerY})`)
      .attr('d', overArc() as string)
      .attr('fill', awayColor)
      .attr('opacity', 0.9)

    // Right gauge center circle
    svg.append('circle')
      .attr('cx', centerX + 130)
      .attr('cy', centerY)
      .attr('r', radius - 28)
      .attr('fill', '#fff')
      .attr('stroke', awayColor)
      .attr('stroke-width', 2)

    // Right gauge percentage text
    svg.append('text')
      .attr('x', centerX + 130)
      .attr('y', centerY + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', awayColor)
      .style('font-family', 'inherit')
      .text(`${overProbability}%`)

    // Right gauge label
    svg.append('text')
      .attr('x', centerX + 130)
      .attr('y', centerY - 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .text('OVER 2.5')

    // Add tick marks on both gauges
    const addTickMarks = (x: number, y: number, radius: number, color: string) => {
      for (let i = 0; i <= 4; i++) {
        const angle = -Math.PI / 2 + (i / 4) * Math.PI
        const innerX = x + (radius - 8) * Math.cos(angle)
        const innerY = y + (radius - 8) * Math.sin(angle)
        const outerX = x + (radius + 3) * Math.cos(angle)
        const outerY = y + (radius + 3) * Math.sin(angle)
        
        svg.append('line')
          .attr('x1', innerX)
          .attr('y1', innerY)
          .attr('x2', outerX)
          .attr('y2', outerY)
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
      }
    }

    addTickMarks(centerX - 130, centerY, radius, homeColor)
    addTickMarks(centerX + 130, centerY, radius, awayColor)

  }, [overProbability, underProbability, width, height, homeColor, awayColor])

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>Probability comparison for total goals market</Subtitle>
      
      <GaugeContainer>
        <GaugeWrapper>
          <GaugeLabel $color={homeColor}>UNDER 2.5 GOALS</GaugeLabel>
          <GaugeValue $color={homeColor}>{underProbability}%</GaugeValue>
          <GaugeSubLabel>{homeTeam}傾向</GaugeSubLabel>
        </GaugeWrapper>
        
        <GaugeWrapper>
          <GaugeLabel $color={awayColor}>OVER 2.5 GOALS</GaugeLabel>
          <GaugeValue $color={awayColor}>{overProbability}%</GaugeValue>
          <GaugeSubLabel>{awayTeam}傾向</GaugeSubLabel>
        </GaugeWrapper>
      </GaugeContainer>
      
      <ChartContainer>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </ChartContainer>
    </Wrapper>
  )
}

export default DualGaugeChart