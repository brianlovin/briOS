import {
  useBroadcastEvent,
  useEventListener,
  useOthersPresence,
  useUpdateMyPresence,
} from '@liveblocks/react'
import React, { MutableRefObject, useRef } from 'react'

const SVG_CURSOR_OFFSET_X = 10
const SVG_CURSOR_OFFSET_Y = -4

const COLORS = [
  '#E57373',
  '#9575CD',
  '#4FC3F7',
  '#81C784',
  '#FF8A65',
  '#F06292',
  '#7986CB',
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
    <svg
      style={{
        transition: 'transform 0.5s cubic-bezier(.17,.93,.38,1)',
        transform: `translateX(${
          presence.cursor.x + SVG_CURSOR_OFFSET_X
        }px) translateY(${presence.cursor.y + SVG_CURSOR_OFFSET_Y}px)`,
      }}
      className="absolute hidden md:inline"
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={COLORS[connectionId % COLORS.length]}
      />
    </svg>
  )
}
