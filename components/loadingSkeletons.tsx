'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;	

const SkeletonBase = styled.div<{ $height: string; $width?: string; $radius?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius || '8px'};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.fade} 0%,
    ${({ theme }) => theme.colors.fade} 40%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.fade} 60%,
    ${({ theme }) => theme.colors.fade} 100%
  );
  background-size: 250% 100%;
  animation: ${shimmer} 2.5s ease-in-out infinite;
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LeagueSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const LeagueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.adBg};
`;

const MatchRow = styled.div`
  padding: 12px;
`;

const MatchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 45px 55px 45px 1fr;
  align-items: center;
  gap: 8px;
`;

const TeamColumn = styled.div<{ $align?: 'flex-start' | 'flex-end' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => $align || 'flex-start'};
  gap: 8px;
`;

const TeamLine = styled.div<{ $align?: 'flex-start' | 'flex-end' }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) => $align || 'flex-start'};
  gap: 8px;
  width: 100%;
`;

const ScoreColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const PredictionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const PredictionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px;
  width: 100%;
`;

const PredictionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const PredictionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PredictionTeams = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 15px 45px 15px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
`;

const OddsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const MatchPageShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  width: 100%;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  width: 100%;
`;

export const SkeletonBlock = ({
  height,
  width,
  radius,
}: {
  height: string;
  width?: string;
  radius?: string;
}) => <SkeletonBase $height={height} $width={width} $radius={radius} />;

export const FeedSkeleton = ({
  sections = 2,
  matchesPerSection = 3,
}: {
  sections?: number;
  matchesPerSection?: number;
}) => (
  <FeedContainer data-cy="feed-skeleton">
    {Array.from({ length: sections }).map((_, sectionIndex) => (
      <LeagueSection key={sectionIndex}>
        <LeagueHeader>
          <SkeletonBase $height="24px" $width="24px" $radius="50%" />
          <SkeletonBase $height="16px" $width="180px" />
        </LeagueHeader>

        {Array.from({ length: matchesPerSection }).map((__, matchIndex) => (
          <React.Fragment key={matchIndex}>
            <MatchRow>
              <MatchGrid>
                <TeamColumn $align="flex-start">
                  <TeamLine $align="flex-start">
                    <SkeletonBase $height="20px" $width="20px" $radius="50%" />
                    <SkeletonBase $height="14px" $width="90px" />
                  </TeamLine>
                  <TeamLine $align="flex-start">
                    <SkeletonBase $height="20px" $width="20px" $radius="50%" />
                    <SkeletonBase $height="14px" $width="110px" />
                  </TeamLine>
                </TeamColumn>

                <ScoreColumn>
                  <SkeletonBase $height="18px" $width="18px" />
                </ScoreColumn>
                <ScoreColumn>
                  <SkeletonBase $height="14px" $width="42px" />
                </ScoreColumn>
                <ScoreColumn>
                  <SkeletonBase $height="18px" $width="18px" />
                </ScoreColumn>

                <TeamColumn $align="flex-end">
                  <SkeletonBase $height="12px" $width="72px" />
                  <SkeletonBase $height="12px" $width="56px" />
                </TeamColumn>
              </MatchGrid>
            </MatchRow>
            {matchIndex < matchesPerSection - 1 && <Divider />}
          </React.Fragment>
        ))}
      </LeagueSection>
    ))}
  </FeedContainer>
);

export const PredictionFeedSkeleton = ({ items = 5 }: { items?: number }) => (
  <PredictionContainer data-cy="prediction-feed-skeleton">
    {Array.from({ length: items }).map((_, index) => (
      <PredictionCard key={index}>
        <PredictionHeader>
          <SkeletonBase $height="16px" $width="90px" />
          <SkeletonBase $height="16px" $width="48px" />
        </PredictionHeader>

        <PredictionContent>
          <PredictionTeams>
            <TeamLine $align="flex-start">
              <SkeletonBase $height="18px" $width="18px" $radius="50%" />
              <SkeletonBase $height="14px" $width="76px" />
            </TeamLine>
            <SkeletonBase $height="20px" $width="12px" />
            <SkeletonBase $height="18px" $width="36px" />
            <SkeletonBase $height="20px" $width="12px" />
            <TeamLine $align="flex-end">
              <SkeletonBase $height="14px" $width="76px" />
              <SkeletonBase $height="18px" $width="18px" $radius="50%" />
            </TeamLine>
          </PredictionTeams>

          <OddsRow>
            <SkeletonBase $height="24px" />
            <SkeletonBase $height="24px" />
            <SkeletonBase $height="24px" />
          </OddsRow>

          <SkeletonBase $height="96px" />
        </PredictionContent>
      </PredictionCard>
    ))}
  </PredictionContainer>
);

export const MatchDetailSkeleton = () => (
  <MatchPageShell data-cy="match-detail-skeleton">
    <SkeletonBase $height="16px" $width="220px" />
    <SkeletonBase $height="24px" $width="280px" />
    <SkeletonBase $height="18px" $width="320px" />
    <SkeletonBase $height="18px" $width="240px" />

    <MainGrid>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card>
          <SkeletonBase $height="180px" />
        </Card>
        <Card>
          <SkeletonBase $height="220px" />
        </Card>
      </div>
      <Card>
        <SkeletonBase $height="20px" $width="120px" />
        <div style={{ height: '12px' }} />
        <PredictionFeedSkeleton items={3} />
      </Card>
    </MainGrid>
  </MatchPageShell>
);