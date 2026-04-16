'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface MomentumDataPoint {
  minute: number
  homeMomentum: number
  awayMomentum: number
}

interface MatchMomentumChartProps {
  data?: MomentumDataPoint[]
  width?: number
  height?: number
  homeTeam?: string
  awayTeam?: string
  homeColor?: string
  awayColor?: string
  homeBadge?: string
  awayBadge?: string
  title?: string
}

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px 10px;
  border-radius: 14px;
  font-family: inherit;
  background: ${({ theme }) => theme.colors?.white || '#fff'};
`

const ChartArea = styled.div`
  position: relative;

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
  margin-bottom: 4px;
  font-family: inherit;
`

const Subtitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #666;
  text-align: center;
  margin-bottom: 8px;
  font-family: inherit;
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
  width: 16px;
  height: 3px;
  background: ${({ $color }) => $color};
  border-radius: 2px;
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

function generateDefaultData(): MomentumDataPoint[] {
  const data: MomentumDataPoint[] = []
  for (let minute = 0; minute <= 90; minute += 5) {
    const homeMomentum = 40 + Math.sin(minute * 0.05) * 20 + Math.random() * 10
    const awayMomentum = 100 - homeMomentum + (Math.random() * 10 - 5)
    data.push({
      minute,
      homeMomentum: Math.min(Math.max(Math.round(homeMomentum), 20), 80),
      awayMomentum: Math.min(Math.max(Math.round(awayMomentum), 20), 80),
    })
  }
  return data
}

const MatchMomentumChart: React.FC<MatchMomentumChartProps> = ({
  data,
  width = 500,
  height = 280,
  homeTeam = 'Home Team',
  awayTeam = 'Away Team',
  homeColor = '#2db84b',
  awayColor = '#f5a623',
  homeBadge,
  awayBadge,
  title = 'Match Momentum',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const resolvedData = useMemo(() => data ?? generateDefaultData(), [data])

  const margin = { top: 30, right: 30, bottom: 40, left: 40 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  useEffect(() => {
    if (!svgRef.current || !resolvedData.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleLinear()
      .domain([0, 90])
      .range([0, innerW])

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([innerH, 0])

    const xAxis = d3.axisBottom(xScale)
      .tickValues([0, 15, 30, 45, 60, 75, 90])
      .tickFormat(d => {
        if (d === 45) return '45\''
        if (d === 90) return '90\''
        return `${d}'`
      })

    const yAxis = d3.axisLeft(yScale)
      .tickValues([0, 25, 50, 75, 100])
      .tickFormat(d => `${d}%`)

    g.append('g')
      .attr('transform', `translate(0, ${innerH})`)
      .call(xAxis)
      .style('font-size', '9px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .call(g => g.select('.domain').attr('stroke', 'none'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'none'))

    g.append('g')
      .call(yAxis)
      .style('font-size', '9px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .call(g => g.select('.domain').attr('stroke', 'none'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'none'))

    g.selectAll('.grid-line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e8e8e8')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '4,4')

    g.selectAll('.grid-line-vertical')
      .data([15, 30, 45, 60, 75])
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerH)
      .attr('stroke', '#e8e8e8')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '4,4')

    const halfLine = yScale(50)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', halfLine)
      .attr('y2', halfLine)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '6,4')

    g.append('text')
      .attr('x', innerW - 5)
      .attr('y', halfLine - 5)
      .attr('text-anchor', 'end')
      .style('font-size', '8px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .text('neutral')

    const homeLine = d3.line<MomentumDataPoint>()
      .x(d => xScale(d.minute))
      .y(d => yScale(d.homeMomentum))
      .curve(d3.curveCatmullRom.alpha(0.5))

    const awayLine = d3.line<MomentumDataPoint>()
      .x(d => xScale(d.minute))
      .y(d => yScale(d.awayMomentum))
      .curve(d3.curveCatmullRom.alpha(0.5))

    const homeArea = d3.area<MomentumDataPoint>()
      .x(d => xScale(d.minute))
      .y0(yScale(50))
      .y1(d => yScale(d.homeMomentum))
      .curve(d3.curveCatmullRom.alpha(0.5))

    const awayArea = d3.area<MomentumDataPoint>()
      .x(d => xScale(d.minute))
      .y0(yScale(50))
      .y1(d => yScale(d.awayMomentum))
      .curve(d3.curveCatmullRom.alpha(0.5))

    g.append('path')
      .datum(resolvedData)
      .attr('fill', homeColor)
      .attr('fill-opacity', 0.15)
      .attr('d', homeArea)

    g.append('path')
      .datum(resolvedData)
      .attr('fill', awayColor)
      .attr('fill-opacity', 0.15)
      .attr('d', awayArea)

    g.append('path')
      .datum(resolvedData)
      .attr('fill', 'none')
      .attr('stroke', homeColor)
      .attr('stroke-width', 2.5)
      .attr('d', homeLine)

    g.append('path')
      .datum(resolvedData)
      .attr('fill', 'none')
      .attr('stroke', awayColor)
      .attr('stroke-width', 2.5)
      .attr('d', awayLine)

    const lastDataPoint = resolvedData[resolvedData.length - 1]
    
    g.append('circle')
      .attr('cx', xScale(lastDataPoint.minute))
      .attr('cy', yScale(lastDataPoint.homeMomentum))
      .attr('r', 4)
      .attr('fill', homeColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    g.append('circle')
      .attr('cx', xScale(lastDataPoint.minute))
      .attr('cy', yScale(lastDataPoint.awayMomentum))
      .attr('r', 4)
      .attr('fill', awayColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    const firstHalfLabel = xScale(22.5)
    const secondHalfLabel = xScale(67.5)
    
    g.append('text')
      .attr('x', firstHalfLabel)
      .attr('y', innerH + 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '9px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text('FIRST HALF')

    g.append('text')
      .attr('x', secondHalfLabel)
      .attr('y', innerH + 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '9px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text('SECOND HALF')

    const halftimeLine = xScale(45)
    g.append('line')
      .attr('x1', halftimeLine)
      .attr('x2', halftimeLine)
      .attr('y1', 0)
      .attr('y2', innerH)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '8,4')

  }, [resolvedData, innerW, innerH, homeColor, awayColor])

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>Attacking momentum flow</Subtitle>
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
          {awayBadge && <TeamBadge src={awayBadge} alt={awayTeam} />}
          <LegendColor $color={awayColor} />
          <LegendText>{awayTeam}</LegendText>
        </LegendItem>
      </Legend>
    </Wrapper>
  )
}

export default MatchMomentumChart