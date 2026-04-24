'use client';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const SkeletonPulse = styled.div`
  background: ${({ theme }) => theme.colors.fade};
  border-radius: 8px;
  animation: ${pulse} 1.5s infinite ease-in-out;
  width: 100%;
`;

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const SkeletonItem = styled(SkeletonPulse)`
  height: 80px;
`;

export default function TableSkeleton() {
  return (
    <SkeletonWrapper>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </SkeletonWrapper>
  );
}