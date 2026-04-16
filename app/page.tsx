import Image from "next/image";
import styles from "./page.module.css";
import HotTag from "@/components/hotTag";
import BestOddTag from "@/components/bestOddTag";
import ConnectedTags from "@/components/connectedTags";
import BoostIcon from "@/components/boostIcon";
import Superboost from "@/components/superboost";
import PriceBoostCard from "@/components/priceBoostCard";
import OddScoreItem from "@/components/oddScoreItem";
import Score from "@/components/score";
import OddHistory from "@/components/charts/oddsHistory";
import OddHistoryMultiple from "@/components/charts/oddsHistoryMultiple";
import CircularBarplot from "@/components/charts/circularPlot";
import PossessionClock from "@/components/charts/possessionClock";
import GoalTimingChart from "@/components/charts/goalTiming";
import MatchMomentumChart from "@/components/charts/momentum";
import WinProbabilityMeter from "@/components/charts/winProbabilityMeter";
import CorrectScoreHeatmap from "@/components/charts/correctScoreHeatmap";
import { probData, scoreData } from "@/data/scoreProb";
import OverUnderGoalsProbability from "@/components/charts/overUnderGoalsProbability";
import Lineup from "@/components/lineup";
import { awayTeamData, homeTeamData } from "@/data/lineup";
import TeamComparisonChart from "@/components/charts/teamComparison";
import { comparisonData } from "@/data/comparison";
import MatchComparison from "@/components/charts/teamComparison";
import OddScoreHead from "@/components/oddScoreHead";
import styled from "styled-components";
import WaterfallChart from "@/components/charts/waterfall";
import DualGaugeChart from "@/components/charts/dualGuage";
import Board from "@/components/board";
import Form from "@/components/form";



const goalData = [
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

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Board/>
        <OddHistory />
        <Form/>

        <OddHistoryMultiple />

              <MatchComparison 
        data={comparisonData}
        homeTeam="Arsenal"
        awayTeam="Chelsea"
        homeColor="#ef0107"
        awayColor="#034694"
        width={700}
        height={450}
        title="Arsenal vs Chelsea - Match Analysis"
      />
        
<Lineup 
  homeTeam={homeTeamData}
  awayTeam={awayTeamData}
  isActive={true}
/>
<GoalTimingChart 
  data={goalData}
          teamName="Manchester City"
  color="#1c7c4c"
  title="Goal Timing Analysis"
        />
              <DualGaugeChart 
        overProbability={62}
        underProbability={38}
        homeTeam="Arsenal"
        awayTeam="Chelsea"
        homeColor="#ef0107"
        awayColor="#034694"
        title="Arsenal vs Chelsea - Goal Line"
      />
        <WinProbabilityMeter 
  homeProbability={58}
  awayProbability={25}
  drawProbability={17}
  homeTeam="Arsenal"
  awayTeam="Chelsea"
  homeColor="#ef0107"
  awayColor="#034694"
  homeBadge="https://img.sofascore.com/api/v1/team/42/image"
  awayBadge="https://img.sofascore.com/api/v1/team/43/image"
        />
        <OverUnderGoalsProbability 
  data={probData}
  homeTeam="Arsenal"
  awayTeam="Chelsea"
  homeBadge="https://img.sofascore.com/api/v1/team/42/image"
  awayBadge="https://img.sofascore.com/api/v1/team/43/image"
        />
        <WaterfallChart />
        <CorrectScoreHeatmap 
  data={scoreData}
  homeTeam="Arsenal"
  awayTeam="Chelsea"
  homeBadge="https://img.sofascore.com/api/v1/team/42/image"
  awayBadge="https://img.sofascore.com/api/v1/team/43/image"
/>
        <MatchMomentumChart 
  homeTeam="Arsenal"
  awayTeam="Chelsea"
  homeColor="#ef0107"
  awayColor="#034694"
  homeBadge="https://img.sofascore.com/api/v1/team/42/image"
  awayBadge="https://img.sofascore.com/api/v1/team/43/image"
/>
        <PossessionClock 
  homePercentage={58}
  awayPercentage={42}
  homeTeam="Arsenal"
  awayTeam="Chelsea"
/>
        <CircularBarplot 
  width={500}
  height={500}
  innerRadius={80}
  color="#ff6b00"
  title="Distribution"
/>
          <OddScoreItem status="live"/>
          <OddScoreItem status="not_started"/>
          <OddScoreItem status="ended"/>
          <OddScoreItem status="cancelled"/>
          <OddScoreItem status="halftime"/>
          <OddScoreItem status="postponed"/>

        <div className={styles.intro}>
          <HotTag />
          <BestOddTag />
          <ConnectedTags />
          <BoostIcon />
          <Superboost />
          <PriceBoostCard />
          <h1>To get started, edit the page.tsx file.</h1>
          <p>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
