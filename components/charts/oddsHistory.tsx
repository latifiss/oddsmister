'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

/* ===== Types ===== */
interface DataPoint {
  time: Date
  value: number
}

interface OddHistoryProps {
  data?: DataPoint[]
  width?: number
  height?: number
  label?: string
  accentColor?: string
  timeLabel?: string
}

/* ===== Styled Components ===== */
const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px 10px;
  border-radius: 14px;
  font-family: inherit;
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

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const LegendLine = styled.div<{ $color: string }>`
  width: 18px;
  height: 2.5px;
  background: ${({ $color }) => $color};
  border-radius: 2px;
`

const LegendDot = styled.div<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 2px solid ${({ $color }) => $color};
  background: #fff;
  margin-left: -4px;
`

const LegendLabel = styled.span`
  font-size: 11px;
  color: #555;
  font-weight: 500;
  margin-left: 2px;
  font-family: inherit;
`

/* ===== Default Demo Data ===== */
function generateDefaultData(): DataPoint[] {
  const base = new Date('2024-03-24T00:00:00')
  const raw = [
    3.3, 2.7, 2.55, 2.6, 2.5, 2.55, 2.52, 2.58, 2.6, 2.55
  ]
  return raw.map((value, i) => ({
    time: new Date(base.getTime() + i * 15 * 60 * 1000),
    value,
  }))
}

/* ===== Component ===== */
const OddHistory: React.FC<OddHistoryProps> = ({
  data,
  width = 280,
  height = 130,
  label = 'Barracas',
  accentColor = '#2db84b',
  timeLabel = '06:23',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const resolvedData = useMemo(() => data ?? generateDefaultData(), [data])

  const margin = { top: 10, right: 10, bottom: 28, left: 32 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  useEffect(() => {
    if (!svgRef.current || !resolvedData.length) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    /* ── Scales ── */
    const xExtent = d3.extent(resolvedData, d => d.time) as [Date, Date]
    const yExtent = d3.extent(resolvedData, d => d.value) as [number, number]
    const yPad = (yExtent[1] - yExtent[0]) * 0.15

    const xScale = d3.scaleTime().domain(xExtent).range([0, innerW])
    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPad, yExtent[1] + yPad])
      .range([innerH, 0])

    /* ── Grid lines ── */
    const yTicks = yScale.ticks(4)
    g.selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#d8ddd8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')

    /* ── Y Axis with alternating visibility ── */
    yTicks.forEach((tick, index) => {
      const shouldShowLabel = index % 2 === 0
      
      if (shouldShowLabel) {
        g.append('text')
          .attr('x', -6)
          .attr('y', yScale(tick))
          .attr('dy', '3px')
          .attr('text-anchor', 'end')
          .style('font-size', '9px')
          .style('fill', '#999')
          .style('font-family', 'inherit')
          .text(d3.format('.2f')(tick))
      }
    })

    /* ── X Axis labels (just start + end) ── */
    const firstDate = resolvedData[0].time
    const xDateLabel = d3.timeFormat('%b %-d')(firstDate)

    g.append('text')
      .attr('x', 0)
      .attr('y', innerH + 18)
      .attr('fill', '#999')
      .style('font-size', '9px')
      .style('font-family', 'inherit')
      .text(xDateLabel)

    const timeLabelG = g.append('g')
      .attr('transform', `translate(${innerW}, ${innerH + 10})`)

    timeLabelG.append('rect')
      .attr('x', -26)
      .attr('y', -1)
      .attr('width', 34)
      .attr('height', 14)
      .attr('rx', 3)
      .attr('fill', accentColor)

    timeLabelG.append('text')
      .attr('x', -9)
      .attr('y', 9.5)
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .style('font-size', '9px')
      .style('font-weight', '700')
      .style('font-family', 'inherit')
      .text(timeLabel)

    const gradId = 'chart-grad'
    const defs = svg.append('defs')
    const grad = defs.append('linearGradient')
      .attr('id', gradId)
      .attr('x1', '0').attr('y1', '0')
      .attr('x2', '0').attr('y2', '1')

    grad.append('stop').attr('offset', '0%').attr('stop-color', accentColor).attr('stop-opacity', 0.22)
    grad.append('stop').attr('offset', '100%').attr('stop-color', accentColor).attr('stop-opacity', 0.02)

    const area = d3.area<DataPoint>()
      .x(d => xScale(d.time))
      .y0(innerH)
      .y1(d => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5))

    g.append('path')
      .datum(resolvedData)
      .attr('fill', `url(#${gradId})`)
      .attr('d', area)

    const line = d3.line<DataPoint>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5))

    g.append('path')
      .datum(resolvedData)
      .attr('fill', 'none')
      .attr('stroke', accentColor)
      .attr('stroke-width', 1.8)
      .attr('d', line)

    g.selectAll('.dot')
      .data(resolvedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.time))
      .attr('cy', d => yScale(d.value))
      .attr('r', 3)
      .attr('fill', '#fff')
      .attr('stroke', accentColor)
      .attr('stroke-width', 1.5)

  }, [resolvedData, innerW, innerH, accentColor, timeLabel])

  return (
    <Wrapper>
      <ChartArea>
        <svg
          ref={svgRef}
          width={width}
          height={height}
        />
      </ChartArea>

      <Legend>
        <LegendLine $color={accentColor} />
        <LegendDot $color={accentColor} />
        <LegendLabel>{label}</LegendLabel>
      </Legend>
    </Wrapper>
  )
}

export default OddHistory