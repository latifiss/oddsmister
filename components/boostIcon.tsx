'use client'

import * as React from "react"
import { SVGProps, Ref, forwardRef, useEffect, useState } from "react"

interface BoostIconProps extends SVGProps<SVGSVGElement> {
  speed?: number
}

const BoostIcon = (
  { speed = 300, ...props }: BoostIconProps,
  ref: Ref<SVGSVGElement>
) => {
  const [opacityState, setOpacityState] = useState({
    arrow1: 1,
    arrow2: 0.5,
    arrow3: 0.2
  })

  useEffect(() => {
    const opacities = [
      { arrow1: 1, arrow2: 0.5, arrow3: 0.2 },
      { arrow1: 0.2, arrow2: 1, arrow3: 0.5 },
      { arrow1: 0.5, arrow2: 0.2, arrow3: 1 }
    ]
    
    let index = 0
    const interval = setInterval(() => {
      setOpacityState(opacities[index % opacities.length])
      index++
    }, speed)

    return () => clearInterval(interval)
  }, [speed])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={12}
      fill="none"
      ref={ref}
      {...props}
    >
      <g clipPath="url(#a)">
        <g clipPath="url(#b)">
          <g clipPath="url(#c)">
            <path
              fill="#23DF8C"
              opacity={opacityState.arrow1}
              d="M2.095 1.742 6.37.015l4.131 1.727v2.592L6.371 2.606 2.095 4.334V1.742Z"
            />
          </g>
        </g>
      </g>
      <g clipPath="url(#d)">
        <g clipPath="url(#e)">
          <g clipPath="url(#f)">
            <path
              fill="#23DF8C"
              opacity={opacityState.arrow2}
              d="M2.095 5.572 6.37 3.845l4.131 1.727v2.591L6.371 6.436 2.095 8.163v-2.59Z"
            />
          </g>
        </g>
      </g>
      <g clipPath="url(#g)">
        <g clipPath="url(#h)">
          <path
            fill="#23DF8C"
            opacity={opacityState.arrow3}
            d="m2.095 9.404 4.276-1.73 4.131 1.73v2.593l-4.131-1.729-4.276 1.729V9.404Z"
          />
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 .003h13v4.33H0z" />
        </clipPath>
        <clipPath id="b">
          <path fill="#fff" d="M0 .003h13v4.33H0z" />
        </clipPath>
        <clipPath id="c">
          <path fill="#fff" d="M0 .003h13v4.33H0z" />
        </clipPath>
        <clipPath id="d">
          <path fill="#fff" d="M0 3.833h13v4.33H0z" />
        </clipPath>
        <clipPath id="e">
          <path fill="#fff" d="M0 3.833h13v4.33H0z" />
        </clipPath>
        <clipPath id="f">
          <path fill="#fff" d="M0 3.833h13v4.33H0z" />
        </clipPath>
        <clipPath id="g">
          <path fill="#fff" d="M0 7.663h13v4.333H0z" />
        </clipPath>
        <clipPath id="h">
          <path fill="#fff" d="M0 7.663h13v4.333H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const ForwardRef = forwardRef(BoostIcon)
export default ForwardRef