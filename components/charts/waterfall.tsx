'use client'

import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface WaterfallDataPoint {
  label: string
  value: number
}

interface WaterfallChartProps {
  data?: WaterfallDataPoint[]
  width?: number
  height?: number
  underColor?: string
  overColor?: string
  title?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors?.white || '#fff'};
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-x: auto;
`

const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  width = 500,
  height = 400,
  underColor = '#fc8d59',
  overColor = '#d73027',
  title = 'Goal Line Probability Distribution',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const defaultData: WaterfallDataPoint[] = [
    { label: 'Under 0.5', value: 12 },
    { label: 'Under 1.5', value: 28 },
    { label: 'Under 2.5', value: 55 },
    { label: 'Over 2.5', value: 45 },
    { label: 'Over 3.5', value: 28 },
    { label: 'Over 4.5', value: 15 },
  ]

  const resolvedData = data || defaultData
  const maxValue = Math.max(...resolvedData.map(d => d.value))

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 50, left: 60 }
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleBand()
      .domain(resolvedData.map(d => d.label))
      .range([0, innerW])
      .padding(0.3)

    const yScale = d3.scaleLinear()
      .domain([0, maxValue + 10])
      .range([innerH, 0])

    const yTicks = yScale.ticks(5)
    g.selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e8e8e8')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '4,4')

    resolvedData.forEach((d, i) => {
      const isUnder = d.label.includes('Under')
      const color = isUnder ? underColor : overColor
      
      g.append('rect')
        .attr('x', xScale(d.label) || 0)
        .attr('y', yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', innerH - yScale(d.value))
        .attr('fill', color)
        .attr('rx', 4)
        .attr('opacity', 0.85)

      g.append('text')
        .attr('x', (xScale(d.label) || 0) + xScale.bandwidth() / 2)
        .attr('y', yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', color)
        .style('font-family', 'inherit')
        .text(`${d.value}%`)
    })

    g.append('g')
      .attr('transform', `translate(0, ${innerH})`)
      .call(d3.axisBottom(xScale))
      .style('font-size', '10px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .call(g => g.select('.domain').attr('stroke', '#ccc'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`))
      .style('font-size', '9px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .call(g => g.select('.domain').attr('stroke', '#ccc'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))

    const line50 = yScale(50)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', line50)
      .attr('y2', line50)
      .attr('stroke', '#999')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5')

    g.append('text')
      .attr('x', innerW - 5)
      .attr('y', line50 - 5)
      .attr('text-anchor', 'end')
      .style('font-size', '8px')
      .style('fill', '#999')
      .style('font-family', 'inherit')
      .text('50%')

  }, [resolvedData, width, height, underColor, overColor, maxValue])

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>Probability distribution across goal lines</Subtitle>
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

export default WaterfallChart