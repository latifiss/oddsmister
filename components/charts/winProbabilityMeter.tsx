'use client'

import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface WinProbabilityMeterProps {
  homeProbability?: number
  awayProbability?: number
  drawProbability?: number
  homeTeam?: string
  awayTeam?: string
  homeColor?: string
  awayColor?: string
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
`

const ChartArea = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -24px;

  svg {
    display: block;
    overflow: visible;
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
  font-family: inherit;
`

const Subtitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #666;
  text-align: center;
  font-family: inherit;
  margin-top: -8px;
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 8px;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`

const LegendText = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #555;
  font-family: inherit;
`

const TeamBadge = styled.img`
  width: 14px;
  height: 14px;
  object-fit: contain;
`

const WinProbabilityMeter: React.FC<WinProbabilityMeterProps> = ({
  homeProbability = 55,
  awayProbability = 25,
  drawProbability = 20,
  homeTeam = 'Home Team',
  awayTeam = 'Away Team',
  homeColor = '#2db84b',
  awayColor = '#f5a623',
  homeBadge,
  awayBadge,
  width = 400,
  height = 240,
  title = 'Win Probability',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const total = homeProbability + awayProbability + drawProbability
  const normalizedHome = (homeProbability / total) * 100
  const normalizedAway = (awayProbability / total) * 100
  const normalizedDraw = (drawProbability / total) * 100

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const centerX = width / 2
    const centerY = height - 50
    const radius = Math.min(width, height) * 0.35
    const startAngle = -Math.PI / 1.8
    const endAngle = Math.PI / 1.8
    const totalAngle = endAngle - startAngle

    const defs = svg.append('defs')

    const homeGrad = defs.append('linearGradient')
      .attr('id', 'homeGrad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%')
    
    homeGrad.append('stop').attr('offset', '0%').attr('stop-color', homeColor).attr('stop-opacity', 0.9)
    homeGrad.append('stop').attr('offset', '100%').attr('stop-color', homeColor).attr('stop-opacity', 0.5)

    const awayGrad = defs.append('linearGradient')
      .attr('id', 'awayGrad')
      .attr('x1', '100%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '0%')
    
    awayGrad.append('stop').attr('offset', '0%').attr('stop-color', awayColor).attr('stop-opacity', 0.9)
    awayGrad.append('stop').attr('offset', '100%').attr('stop-color', awayColor).attr('stop-opacity', 0.5)

    const neutralGrad = defs.append('linearGradient')
      .attr('id', 'neutralGrad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%')
    
    neutralGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ccc').attr('stop-opacity', 0.6)
    neutralGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ccc').attr('stop-opacity', 0.3)

    const arcBackground = d3.arc()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(startAngle)
      .endAngle(endAngle)

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', arcBackground() as string)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1)

    const homeEndAngle = startAngle + (normalizedHome / 100) * totalAngle
    const drawEndAngle = homeEndAngle + (normalizedDraw / 100) * totalAngle

    const homeArc = d3.arc()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(startAngle)
      .endAngle(homeEndAngle)

    const drawArc = d3.arc()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(homeEndAngle)
      .endAngle(drawEndAngle)

    const awayArc = d3.arc()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(drawEndAngle)
      .endAngle(endAngle)

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', homeArc() as string)
      .attr('fill', `url(#homeGrad)`)

    if (normalizedDraw > 0) {
      svg.append('path')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .attr('d', drawArc() as string)
        .attr('fill', `url(#neutralGrad)`)
    }

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', awayArc() as string)
      .attr('fill', `url(#awayGrad)`)

    const tickValues = [0, 25, 50, 75, 100]
    tickValues.forEach(value => {
      const angle = startAngle + (value / 100) * totalAngle
      const x1 = centerX + (radius - 8) * Math.sin(angle)
      const y1 = centerY - (radius - 8) * Math.cos(angle)
      const x2 = centerX + (radius + 5) * Math.sin(angle)
      const y2 = centerY - (radius + 5) * Math.cos(angle)

      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#999')
        .attr('stroke-width', 1.5)

      const labelRadius = radius + 15
      const labelX = centerX + labelRadius * Math.sin(angle)
      const labelY = centerY - labelRadius * Math.cos(angle)

      svg.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '9px')
        .style('fill', '#999')
        .style('font-family', 'inherit')
        .text(`${value}%`)
    })

    const needleAngle = startAngle + (normalizedHome / 100) * totalAngle
    const needleLength = radius - 8
    const needleX = centerX + needleLength * Math.sin(needleAngle)
    const needleY = centerY - needleLength * Math.cos(needleAngle)

    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY - 5)
      .attr('x2', needleX)
      .attr('y2', needleY)
      .attr('stroke', '#333')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round')

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY - 5)
      .attr('r', 6)
      .attr('fill', '#333')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    const homePercentX = centerX - 50
    const homePercentY = centerY + 25

    svg.append('text')
      .attr('x', homePercentX)
      .attr('y', homePercentY)
      .attr('text-anchor', 'middle')
      .style('font-size', '20px')
      .style('fill', homeColor)
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(`${Math.round(normalizedHome)}%`)

    svg.append('text')
      .attr('x', centerX)
      .attr('y', homePercentY)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .text('Draw')

    svg.append('text')
      .attr('x', centerX)
      .attr('y', homePercentY + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#888')
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(`${Math.round(normalizedDraw)}%`)

    const awayPercentX = centerX + 50
    svg.append('text')
      .attr('x', awayPercentX)
      .attr('y', homePercentY)
      .attr('text-anchor', 'middle')
      .style('font-size', '20px')
      .style('fill', awayColor)
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(`${Math.round(normalizedAway)}%`)

  }, [width, height, normalizedHome, normalizedAway, normalizedDraw, homeColor, awayColor])

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>Based on current form and statistics</Subtitle>
      <ChartArea>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        />
      </ChartArea>
      <Legend>
        <LegendItem>
          {homeBadge && <TeamBadge src={homeBadge} alt={homeTeam} />}
          <LegendColor $color={homeColor} />
          <LegendText>{homeTeam}</LegendText>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#ccc" />
          <LegendText>Draw</LegendText>
        </LegendItem>
        <LegendItem>
          {awayBadge && <TeamBadge src={awayBadge} alt={awayTeam} />}
          <LegendColor $color={awayColor} />
          <LegendText>{awayTeam}</LegendText>
        </LegendItem>
      </Legend>
    </Wrapper>
  )
}

export default WinProbabilityMeter