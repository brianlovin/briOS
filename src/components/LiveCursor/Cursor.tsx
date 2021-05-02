import { useEventListener } from '@liveblocks/react'
import React, { MutableRefObject, useRef } from 'react'

const SVG_CURSOR_OFFSET_X = 8
const SVG_CURSOR_OFFSET_Y = -2

const COLORS = [
  '#EF4444',
  '#FBBF24',
  '#10B981',
  '#3B82F6',
  '#6366F1',
  '#EC4899',
  '#F87171',
  '#831843',
  '#064E3B',
]

type Presence = {
  cursor: {
    x: number
    y: number
  } | null
}

type Event = {
  type: 'POINTER_DOWN'
  position: { x: number; y: number }
}

type RippleProps = {
  connectionId: number
  room: string
  containerRef: MutableRefObject<HTMLDivElement>
}

export function Ripple({ connectionId, room, containerRef }: RippleProps) {
  const timeoutId = useRef<number>(0)
  const rippleRef = useRef<HTMLDivElement>(null)

  useEventListener<Event>(room, ({ connectionId: id, event }) => {
    if (
      event.type !== 'POINTER_DOWN' ||
      rippleRef.current == null ||
      connectionId !== id
    ) {
      return
    }

    const bounds = containerRef.current.getBoundingClientRect()

    rippleRef.current.classList.remove('ripple')
    rippleRef.current.offsetHeight
    rippleRef.current.classList.add('ripple')
    rippleRef.current.style.top = `${event.position.y + window.scrollY}px`
    rippleRef.current.style.left = `${event.position.x + bounds.width / 2}px`

    clearTimeout(timeoutId.current)

    timeoutId.current = window.setTimeout(() => {
      rippleRef.current?.classList.remove('ripple')
    }, 2000)
  })

  return (
    <div
      ref={rippleRef}
      style={{
        background: COLORS[connectionId % COLORS.length],
      }}
    ></div>
  )
}

type CursorProps = {
  presence: Presence
  connectionId: number
}

export function Cursor({ presence, connectionId }: CursorProps) {
  return (
    // <svg
    // style={{
    //   transition: 'transform 0.5s cubic-bezier(.17,.93,.38,1)',
    //   transform: `translateX(${
    //     presence.cursor.x + SVG_CURSOR_OFFSET_X
    //   }px) translateY(${presence.cursor.y + SVG_CURSOR_OFFSET_Y}px)`,
    // }}
    // className="absolute hidden md:inline"
    //   width="24"
    //   height="36"
    //   viewBox="0 0 24 36"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
    //     fill={COLORS[connectionId % COLORS.length]}
    //   />
    // </svg>

    <svg
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: 'transform 0.5s cubic-bezier(.17,.93,.38,1)',
        transform: `translateX(${
          presence.cursor.x + SVG_CURSOR_OFFSET_X
        }px) translateY(${presence.cursor.y + SVG_CURSOR_OFFSET_Y}px)`,
      }}
      className="absolute hidden md:inline"
    >
      <g clip-path="url(#clip0)">
        <g filter="url(#filter0_d)">
          <path
            d="M7.65376 14.3681H7.46026L7.31717 14.4984L2.5 18.8837V3.19922L13.7841 14.3681H7.65376Z"
            fill={COLORS[connectionId % COLORS.length]}
          />
          <path
            d="M7.65376 14.8681L7.6538 14.8681H13.7841H15L14.1358 14.0127L2.85173 2.84386L2 2.00082V3.19922V18.8837V20.015L2.83659 19.2534L7.65376 14.8681Z"
            stroke="white"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="-0.5"
          y="0.800781"
          width="18.7159"
          height="24.3439"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <clipPath id="clip0">
          <rect width="24" height="36" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
