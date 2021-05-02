import {
  useBroadcastEvent,
  useOthersPresence,
  useUpdateMyPresence,
} from '@liveblocks/react'
import React, { useRef } from 'react'
import { Cursor, Ripple } from './Cursor'

type Presence = {
  cursor: {
    x: number
    y: number
  } | null
}

type Props = {
  room: string
  children: React.ReactNode
}

export function LiveCursor({ room, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const updatePresence = useUpdateMyPresence<Presence>(room, () => ({
    cursor: null,
  }))
  const others = useOthersPresence<Presence>(room)
  const broadcast = useBroadcastEvent(room)

  function onPointerDown(e) {
    broadcast({
      type: 'POINTER_DOWN',
      position: mouseEventToScenePoint(e, containerRef),
    })
  }

  function onPointerMove(e) {
    updatePresence({
      cursor: mouseEventToScenePoint(e, containerRef),
    })
  }

  function onPointerLeave() {
    updatePresence({
      cursor: null,
    })
  }

  function onWheel(e) {
    updatePresence({
      cursor: mouseEventToScenePoint(e, containerRef),
    })
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onWheel={onWheel}
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

function mouseEventToScenePoint(event, containerRef) {
  if (!containerRef.current || !window) {
    return null
  }

  const bounds = containerRef.current.getBoundingClientRect()

  return {
    x: event.clientX - bounds.left - bounds.width / 2,
    y: event.clientY - bounds.y,
  }
}
