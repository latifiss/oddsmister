'use client'

import React from 'react'
import styled from 'styled-components';
import BoostIcon from './boostIcon';

const Component = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    border-radius: 99px;
    border: 1.5px solid #23DF8C;
    gap: 4px;
`;

const Label = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #23DF8C;
  font-family: inherit;
  text-transform: uppercase;
  font-style: italic;
  white-space: nowrap;
  margin: 0;
  line-height: 1;
`;

const Superboost = () => {
  return (
      <Component>
          <BoostIcon />
      <Label>Superboost</Label>
    </Component>
  )
}

export default Superboost