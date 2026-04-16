'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

/* ===== Types ===== */
interface DataPoint {
  country: string
  value: number
}

interface CircularBarplotProps {
  data?: DataPoint[]
  width?: number
  height?: number
  innerRadius?: number
  outerRadius?: number
  color?: string
  title?: string
}

/* ===== Styled Components ===== */
const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px 10px;
  border-radius: 14px;
  font-family: inherit;
  background: ${({ theme }) => theme.colors?.white || '#fff'};
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

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
  font-family: inherit;
`

/* ===== Default Demo Data ===== */
function generateDefaultData(): DataPoint[] {
  return [
    { country: 'USA', value: 8500 },
    { country: 'China', value: 7200 },
    { country: 'Japan', value: 6100 },
    { country: 'Germany', value: 5400 },
    { country: 'UK', value: 4800 },
    { country: 'France', value: 4300 },
    { country: 'India', value: 3900 },
    { country: 'Brazil', value: 3500 },
    { country: 'Italy', value: 3100 },
    { country: 'Canada', value: 2800 },
  ]
}

/* ===== Component ===== */
const CircularBarplot: React.FC<CircularBarplotProps> = ({
  data,
  width = 460,
  height = 460,
  innerRadius = 80,
  outerRadius: customOuterRadius,
  color = '#69b3a2',
  title = 'Radial Bar Chart',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const resolvedData = useMemo(() => data ?? generateDefaultData(), [data])

  const margin = { top: 10, right: 10, bottom: 10, left: 10 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom
  const outerRadius = customOuterRadius || Math.min(innerW, innerH) / 2

  // Custom radial scale function
  const getRadialScale = (value: number, maxValue: number) => {
    return innerRadius + (value / maxValue) * (outerRadius - innerRadius)
  }

  useEffect(() => {
    if (!svgRef.current || !resolvedData.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr('transform', `translate(${innerW / 2}, ${innerH / 2 + 60})`)

    // X scale (band scale for circular layout)
    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(resolvedData.map(d => d.country))

    // Get max value for scaling
    const maxValue = d3.max(resolvedData, d => d.value) || 10000

    // Add background circles (grid)
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

      // Add grid labels
      g.append('text')
        .attr('x', 5)
        .attr('y', -radius)
        .attr('dy', '-4px')
        .attr('fill', '#999')
        .style('font-size', '9px')
        .style('font-family', 'inherit')
        .text(`${level}%`)
    })

    // Add bars
    g.selectAll('path')
      .data(resolvedData)
      .enter()
      .append('path')
      .attr('fill', color)
      .attr('opacity', 0.85)
      .attr('d', (d: DataPoint) => {
        const startAngle = x(d.country) || 0
        const endAngle = startAngle + x.bandwidth()
        const barOuterRadius = getRadialScale(d.value, maxValue)
        
        return d3.arc()({
          innerRadius: innerRadius,
          outerRadius: barOuterRadius,
          startAngle: startAngle,
          endAngle: endAngle,
          padAngle: 0.02,
          padRadius: innerRadius
        } as any) || ''
      })

    // Add value labels on the bars
    g.selectAll('.bar-label')
      .data(resolvedData)
      .enter()
      .append('text')
      .attr('transform', (d: DataPoint) => {
        const angle = (x(d.country) || 0) + x.bandwidth() / 2
        const radius = getRadialScale(d.value, maxValue) + 8
        const xPos = radius * Math.sin(angle)
        const yPos = -radius * Math.cos(angle)
        return `translate(${xPos}, ${yPos})`
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '9px')
      .style('fill', '#555')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text((d: DataPoint) => d.value.toLocaleString())

    // Add country labels at the outer edge
    g.selectAll('.country-label')
      .data(resolvedData)
      .enter()
      .append('text')
      .attr('transform', (d: DataPoint) => {
        const angle = (x(d.country) || 0) + x.bandwidth() / 2
        const radius = outerRadius + 12
        const xPos = radius * Math.sin(angle)
        const yPos = -radius * Math.cos(angle)
        return `translate(${xPos}, ${yPos})`
      })
      .attr('text-anchor', (d: DataPoint) => {
        const angle = (x(d.country) || 0) + x.bandwidth() / 2
        return Math.abs(Math.cos(angle)) < 0.3 ? 'middle' : 
               Math.cos(angle) > 0 ? 'start' : 'end'
      })
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('fill', '#666')
      .style('font-family', 'inherit')
      .style('font-weight', '500')
      .text((d: DataPoint) => d.country)

    // Add inner circle center label
    g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#333')
      .style('font-family', 'inherit')
      .style('font-weight', 'bold')
      .text(title)

  }, [resolvedData, innerW, innerH, innerRadius, outerRadius, color, title])

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
    </Wrapper>
  )
}

export default CircularBarplot