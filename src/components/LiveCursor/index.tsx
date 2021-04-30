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

export function LiveCursor({
  room,
  children,
}: {
  room: string
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePresence = useUpdateMyPresence<Presence>(room, () => ({
    cursor: null,
  }))

  const others = useOthersPresence<Presence>(room)

  const broadcast = useBroadcastEvent(room)

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        broadcast({
          type: 'POINTER_DOWN',
          position: mouseEventToScenePoint(e, containerRef),
        })
      }}
      onPointerMove={(e) => {
        updatePresence({
          cursor: mouseEventToScenePoint(e, containerRef),
        })
      }}
      onPointerLeave={() => {
        updatePresence({
          cursor: null,
        })
      }}
      onWheel={(e) => {
        updatePresence({
          cursor: mouseEventToScenePoint(e, containerRef),
        })
      }}
    >
      {children}

      <div className="absolute inset-0 flex justify-center pointer-events-none">
        {others.map(({ connectionId, presence }) => {
          if (presence == null || presence.cursor == null) {
            return null
          }

          return (
            <React.Fragment key={`ripple-${connectionId}`}>
              <Ripple
                containerRef={containerRef}
                connectionId={connectionId}
                room={room}
              />
              <Cursor presence={presence} connectionId={connectionId} />
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

function Ripple({
  connectionId,
  room,
  containerRef,
}: {
  connectionId: number
  room: string
  containerRef: MutableRefObject<HTMLDivElement>
}) {
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

function Cursor({
  presence,
  connectionId,
}: {
  presence: Presence
  connectionId: number
}) {
  return (
    <svg
      style={{
        position: 'absolute',
        transition: 'transform 0.5s cubic-bezier(.17,.93,.38,1)',
        transform: `translateX(${
          presence.cursor.x + SVG_CURSOR_OFFSET_X
        }px) translateY(${
          presence.cursor.y + SVG_CURSOR_OFFSET_Y - window.scrollY
        }px)`,
      }}
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

function mouseEventToScenePoint(event, containerRef) {
  if (!containerRef.current || !window) {
    return null
  }

  const bounds = containerRef.current.getBoundingClientRect()

  return {
    x: event.clientX - bounds.left - bounds.width / 2,
    y: event.clientY - bounds.y + window.scrollY,
  }
}
