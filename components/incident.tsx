'use client'

import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

type Player = {
  id: string
  name: string
  slug: string
}

type IncidentType =
  | 'goal'
  | 'card'
  | 'substitution'
  | 'period'
  | 'corner'
  | 'var'
  | 'assist'

type IncidentClass =
  | 'yellow'
  | 'red'
  | 'redyellow'
  | 'penaltymiss'
  | 'owngoal'
  | 'regular'

type IncidentProps = {
  incidentType: IncidentType
  incidentClass?: IncidentClass
  time: number
  addedTime?: number
  isHome: boolean
  player?: Player
  assist?: Player
  playerIn?: Player
  playerOut?: Player
  text?: string
  homeScore?: number
  awayScore?: number
  isActive?: boolean
}

const INCIDENT_ICON_MAP = {
  goal: '/icons/goal.svg',
  yellow: '/icons/yellowcard.svg',
  red: '/icons/redcard.svg',
  redyellow: '/icons/redyellowcard.svg',
  penaltymiss: '/icons/penaltymiss.svg',
  owngoal: '/icons/owngoal.svg',
  assist: '/icons/assist.svg',
  substitution: '/icons/substitution.svg',
  var: '/icons/var.svg',
} as const

const resolveIncidentIcon = (
  incidentType: IncidentType,
  incidentClass?: IncidentClass
) => {
  if (incidentType === 'card' && incidentClass) {
    return INCIDENT_ICON_MAP[incidentClass] ?? INCIDENT_ICON_MAP.yellow
  }
  if (incidentType === 'goal' && incidentClass === 'owngoal') {
    return INCIDENT_ICON_MAP.owngoal
  }
  if (incidentType === 'goal' && incidentClass === 'penaltymiss') {
    return INCIDENT_ICON_MAP.penaltymiss
  }
  return (
    INCIDENT_ICON_MAP[
      incidentType as keyof typeof INCIDENT_ICON_MAP
    ] ?? INCIDENT_ICON_MAP.goal
  )
}

const Row = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid
    ${({ $active }) => ($active ? '#3b82f6' : '#d1d5db')};
  background-color: #ffffff;
`

const Side = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`

const Spacer = styled.div`
  flex: 1;
`

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background-color: #e5e7eb;
`

const IconBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
`

const Minute = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const Name = styled.span`
  font-weight: 500;
  color: #111827;
`

const Assist = styled.span`
  font-weight: 500;
  color: #6b7280;
`

const TextRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

const CenterText = styled.span`
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
`

export default function Incident({
  incidentType,
  incidentClass,
  time,
  addedTime,
  isHome,
  player,
  assist,
  playerIn,
  playerOut,
  text,
  homeScore,
  awayScore,
  isActive,
}: IncidentProps) {
  const isPeriod = incidentType === 'period'

  if (isPeriod) {
    return (
      <Row $active={isActive}>
        <CenterText>
          {text} {homeScore}-{awayScore}
        </CenterText>
      </Row>
    )
  }

  const icon = resolveIncidentIcon(incidentType, incidentClass)
  const minuteText = addedTime ? `${time}+${addedTime}'` : `${time}'`
  const isAway = !isHome

  const renderIncidentText = () => {
    if (incidentType === 'goal') {
      return (
        <TextRow>
          {player && <Name>{player.name}</Name>}
          {assist && <Assist>({assist.name})</Assist>}
        </TextRow>
      )
    }

    if (incidentType === 'substitution') {
      return (
        <TextRow>
          {playerIn && <Name>{playerIn.name}</Name>}
          {playerOut && <Assist>{playerOut.name}</Assist>}
        </TextRow>
      )
    }

    return player ? <Name>{player.name}</Name> : null
  }

  return (
    <Row $active={isActive}>
      {isHome ? (
        <Side>
          <IconBlock>
            <Image src={icon} width={16} height={16} alt="incident" />
            <Minute>{minuteText}</Minute>
          </IconBlock>
          <Divider />
          {renderIncidentText()}
        </Side>
      ) : (
        <Spacer />
      )}

      {isAway ? (
        <Side style={{ justifyContent: 'flex-end' }}>
          {renderIncidentText()}
          <Divider />
          <IconBlock>
            <Image src={icon} width={16} height={16} alt="incident" />
            <Minute>{minuteText}</Minute>
          </IconBlock>
        </Side>
      ) : (
        <Spacer />
      )}
    </Row>
  )
}
