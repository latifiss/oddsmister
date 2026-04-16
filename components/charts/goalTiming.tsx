'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface GoalDataPoint {
  interval: string
  goals: number
}

interface GoalTimingChartProps {
  data?: GoalDataPoint[]
  width?: number
  height?: number
  innerRadius?: number
  outerRadius?: number
  color?: string
  title?: string
  teamName?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  margin-bottom: 8px;
  font-family: inherit;
`

function generateDefaultData(): GoalDataPoint[] {
  return [
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
}

const GoalTimingChart: React.FC<GoalTimingChartProps> = ({
  data,
  width = 500,
  height = 500,
  innerRadius = 90,
  outerRadius: customOuterRadius,
  color = '#f80000',
  title = 'Goal Distribution',
  teamName = 'Arsenal',
}) => {
  const svgRef1 = useRef<SVGSVGElement>(null)
  const svgRef2 = useRef<SVGSVGElement>(null)
  const resolvedData = useMemo(() => data ?? generateDefaultData(), [data])

  const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom
  const outerRadius = customOuterRadius || Math.min(innerW, innerH) / 2

  const totalGoals = useMemo(() => {
    return resolvedData.reduce((sum, item) => sum + item.goals, 0)
  }, [resolvedData])

  const getRadialScale = (value: number, maxValue: number) => {
    return innerRadius + (value / maxValue) * (outerRadius - innerRadius)
  }

  const drawChart = (svgRef: React.RefObject<SVGSVGElement>, teamColor?: string, teamNameOverride?: string) => {
    if (!svgRef.current || !resolvedData.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr('transform', `translate(${innerW / 2}, ${innerH / 2 + 40})`)

    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(resolvedData.map(d => d.interval))

    const maxValue = d3.max(resolvedData, d => d.goals) || 100

    const gridLevels = [25, 50, 75, 100]
    gridLevels.forEach(level => {
      const radius = getRadialScale((maxValue * level) / 100, maxValue)
      
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 0.8)
        .attr('stroke-dasharray', '4,4')

      const goalValue = Math.round((maxValue * level) / 100)
      g.append('text')
        .attr('x', 5)
        .attr('y', -radius)
        .attr('dy', '-4px')
        .attr('fill', '#999')
        .style('font-size', '8px')
        .style('font-family', 'inherit')
        .text(`${goalValue} goals`)
    })

    g.selectAll('path')
      .data(resolvedData)
      .enter()
      .append('path')
      .attr('fill', teamColor || color)
      .attr('opacity', 0.85)
      .attr('d', (d: GoalDataPoint) => {
        const startAngle = x(d.interval) || 0
        const endAngle = startAngle + x.bandwidth()
        const barOuterRadius = getRadialScale(d.goals, maxValue)
        
        return d3.arc()({
          innerRadius: innerRadius,
          outerRadius: barOuterRadius,
          startAngle: startAngle,
          endAngle: endAngle,
          padAngle: 0.02,
          padRadius: innerRadius
        } as any) || ''
      })

    g.selectAll('.bar-label')
      .data(resolvedData)
      .enter()
      .append('text')
      .attr('transform', (d: GoalDataPoint) => {
        const angle = (x(d.interval) || 0) + x.bandwidth() / 2
        const radius = getRadialScale(d.goals, maxValue) + 10
        const xPos = radius * Math.sin(angle)
        const yPos = -radius * Math.cos(angle)
        return `translate(${xPos}, ${yPos})`
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('fill', '#fff')
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .style('text-shadow', '0 0 2px rgba(0,0,0,0.3)')
      .text((d: GoalDataPoint) => d.goals)

    g.selectAll('.interval-label')
      .data(resolvedData)
      .enter()
      .append('text')
      .attr('transform', (d: GoalDataPoint) => {
        const angle = (x(d.interval) || 0) + x.bandwidth() / 2
        const radius = outerRadius + 18
        const xPos = radius * Math.sin(angle)
        const yPos = -radius * Math.cos(angle)
        return `translate(${xPos}, ${yPos})`
      })
      .attr('text-anchor', (d: GoalDataPoint) => {
        const angle = (x(d.interval) || 0) + x.bandwidth() / 2
        return Math.abs(Math.cos(angle)) < 0.3 ? 'middle' : 
               Math.cos(angle) > 0 ? 'start' : 'end'
      })
      .attr('dy', '0.35em')
      .style('font-size', '9px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text((d: GoalDataPoint) => d.interval)

    g.append('text')
      .attr('x', 0)
      .attr('y', -8)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text(teamNameOverride || teamName)

    g.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '20px')
      .style('fill', teamColor || color)
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(`${totalGoals}`)

    g.append('text')
      .attr('x', 0)
      .attr('y', 24)
      .attr('text-anchor', 'middle')
      .style('font-size', '8px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .text('total goals')
  }

  useEffect(() => {
    drawChart(svgRef1, color, teamName)
    drawChart(svgRef2, '#2db84b', 'Chelsea')
  }, [resolvedData, innerW, innerH, innerRadius, outerRadius, color, teamName])

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>Goals by time interval</Subtitle>
      <ChartArea>
        <svg
          ref={svgRef1}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </ChartArea>
      <ChartArea>
        <svg
          ref={svgRef2}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </ChartArea>
    </Wrapper>
  )
}

export default GoalTimingChart