'use client'

import React from 'react';
import styled from 'styled-components';

const Component = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 12px;
  background-color: var(--oi-milano-red);
`

const Number = styled.p`
  font-size: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit ;
  text-decoration: none;
  white-space: nowrap;
  margin-top: 2px;
`;

interface RedCardProps {
  count: string | number;
}

const RedCard: React.FC<RedCardProps> = ({ count }) => {
  const value: number = typeof count === 'string' ? parseInt(count, 10) : count;

  if (value === 0) return null;

  return (
    <Component>
      {value > 1 && <Number>{value}</Number>}
    </Component>
  );
};

export default RedCard;
