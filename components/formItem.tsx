'use client'

import React from 'react'
import styled from 'styled-components'

const Circle = styled.div<{ bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ bgColor }) => bgColor};
  font-size: 16px;
  font-weight: 700;
  padding-top: 2px;
  color: #fff;
  font-family: inherit;
  text-transform: uppercase;
`

interface FormItemProps {
  result: 'W' | 'L' | 'D'
}

const FormItem = ({ result }: FormItemProps) => {
  let bgColor = '#8a949c' 
  if (result === 'W') bgColor = '#00995c' 
  if (result === 'L') bgColor = 'rgba(214, 30, 0, 1)' 

  return <Circle bgColor={bgColor}>{result}</Circle>
}

export default FormItem
