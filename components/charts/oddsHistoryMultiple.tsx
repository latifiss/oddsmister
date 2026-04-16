'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'
import LegendLabel from '../legendLabel'

interface DataPoint {
  time: Date
  value: number
}

interface OddHistoryMultipleProps {
  data1?: DataPoint[]
  data2?: DataPoint[]
  data3?: DataPoint[]
  width?: number
  height?: number
  label1?: string
  label2?: string
  label3?: string
  color1?: string
  color2?: string
  color3?: string
  timeLabel?: string
}

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
  gap: 12px;
  flex-wrap: wrap;
`

const LegendItem = styled.div`
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

const LegendText = styled.span`
  font-size: 11px;
  color: #555;
  font-weight: 500;
  margin-left: 2px;
  font-family: inherit;
`

function generateDefaultData1(): DataPoint[] {
  const base = new Date('2024-03-24T00:00:00')
  const raw = [3.3, 2.7, 2.55, 2.6, 2.5, 2.55, 2.52, 2.58, 2.6, 2.55]
  return raw.map((value, i) => ({
    time: new Date(base.getTime() + i * 15 * 60 * 1000),
    value,
  }))
}

function generateDefaultData2(): DataPoint[] {
  const base = new Date('2024-03-24T00:00:00')
  const raw = [2.8, 2.6, 2.45, 2.5, 2.4, 2.45, 2.42, 2.48, 2.5, 2.45]
  return raw.map((value, i) => ({
    time: new Date(base.getTime() + i * 15 * 60 * 1000),
    value,
  }))
}

function generateDefaultData3(): DataPoint[] {
  const base = new Date('2024-03-24T00:00:00')
  const raw = [2.5, 2.4, 2.35, 2.4, 2.3, 2.35, 2.32, 2.38, 2.4, 2.35]
  return raw.map((value, i) => ({
    time: new Date(base.getTime() + i * 15 * 60 * 1000),
    value,
  }))
}

const OddHistoryMultiple: React.FC<OddHistoryMultipleProps> = ({
  data1,
  data2,
  data3,
  width = 280,
  height = 130,
  label1 = 'Team A',
  label2 = 'Team B',
  label3 = 'Team C',
  color1 = '#2db84b',
  color2 = '#f5a623',
  color3 = '#4a90e2',
  timeLabel = '06:23',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const resolvedData1 = useMemo(() => data1 ?? generateDefaultData1(), [data1])
  const resolvedData2 = useMemo(() => data2 ?? generateDefaultData2(), [data2])
  const resolvedData3 = useMemo(() => data3 ?? generateDefaultData3(), [data3])

  const margin = { top: 10, right: 10, bottom: 28, left: 32 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const allData = [...resolvedData1, ...resolvedData2, ...resolvedData3]
    if (allData.length === 0) return

    const xExtent = d3.extent(allData, d => d.time) as [Date, Date]
    const yExtent = d3.extent(allData, d => d.value) as [number, number]
    const yPad = (yExtent[1] - yExtent[0]) * 0.15

    const xScale = d3.scaleTime().domain(xExtent).range([0, innerW])
    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPad, yExtent[1] + yPad])
      .range([innerH, 0])

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

    const firstDate = resolvedData1[0]?.time || new Date()
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
      .attr('fill', color1)

    timeLabelG.append('text')
      .attr('x', -9)
      .attr('y', 9.5)
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .style('font-size', '9px')
      .style('font-weight', '700')
      .style('font-family', 'inherit')
      .text(timeLabel)

    const drawLineAndDots = (data: DataPoint[], color: string) => {
      if (!data.length) return

      const line = d3.line<DataPoint>()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value))
        .curve(d3.curveCatmullRom.alpha(0.5))

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.8)
        .attr('d', line)

      g.selectAll(`.dot-${color.replace('#', '')}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `dot-${color.replace('#', '')}`)
        .attr('cx', d => xScale(d.time))
        .attr('cy', d => yScale(d.value))
        .attr('r', 3)
        .attr('fill', '#fff')
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
    }

    drawLineAndDots(resolvedData1, color1)
    drawLineAndDots(resolvedData2, color2)
    drawLineAndDots(resolvedData3, color3)

  }, [resolvedData1, resolvedData2, resolvedData3, innerW, innerH, color1, color2, color3, timeLabel])

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
        <LegendItem>
          <LegendLine $color={color1} />
          <LegendDot $color={color1} />
          <LegendLabel teamName={label1} badgeUrl="" />
        </LegendItem>
        <LegendItem>
          <LegendLine $color={color2} />
          <LegendDot $color={color2} />
          <LegendLabel teamName={label2} badgeUrl="" />
        </LegendItem>
        <LegendItem>
          <LegendLine $color={color3} />
          <LegendDot $color={color3} />
          <LegendText>{label3}</LegendText>
        </LegendItem>
      </Legend>
    </Wrapper>
  )
}

export default OddHistoryMultiple