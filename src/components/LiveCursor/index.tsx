import {
  RoomProvider,
  useBroadcastEvent,
  useOthers,
  useMyPresence,
} from '@liveblocks/react'
import React, { useRef } from 'react'
import { Cursor, Ripple } from './Cursor'

type Presence = {
  cursor: {
    x: number
    y: number
  }
}

type Props = {
  room: string
  children: React.ReactNode
}

export function LiveCursor({ room, children }: Props) {
  return (
    <RoomProvider id={room} defaultPresence={() => ({ cursor: null })}>
      <Canvas room={room}>{children}</Canvas>
    </RoomProvider>
  )
}

export function Canvas({ children }: Props) {
  const [_, updateMyPresence] = useMyPresence()
  const containerRef = useRef(null)
  const others = useOthers<Presence>()
  const broadcast = useBroadcastEvent()

  function onFocus(e) {
    updateMyPresence({
      cursor: mouseEventToScenePoint(e, containerRef),
    })
  }

  function onBlur() {
    updateMyPresence({
      cursor: null,
    })
  }

  // handle users app switching away from browser or switching tabs
  React.useEffect(() => {
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  })

  function onPointerDown(e) {
    broadcast({
      type: 'POINTER_DOWN',
      position: mouseEventToScenePoint(e, containerRef),
    })
  }

  function onPointerMove(e) {
    updateMyPresence({
      cursor: mouseEventToScenePoint(e, containerRef),
    })
  }

  function onPointerLeave() {
    updateMyPresence({
      cursor: null,
    })
  }

  function onWheel(e) {
    updateMyPresence({
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

      <div className="absolute inset-0 justify-center hidden pointer-events-none md:flex">
        {others.map(({ connectionId, presence }) => {
          if (presence && presence.cursor) {
            return (
              <React.Fragment key={`ripple-${connectionId}`}>
                <Ripple
                  containerRef={containerRef}
                  connectionId={connectionId}
                />
                <Cursor presence={presence} connectionId={connectionId} />
              </React.Fragment>
            )
          } else {
            return null
          }
        })}
      </div>
    </div>
  )
}

function mouseEventToScenePoint(event, containerRef) {
  if (!containerRef.current) {
    return null
  }

  const boundingRectangle = containerRef.current.getBoundingClientRect()
  return {
    x: event.clientX - boundingRectangle.left - boundingRectangle.width / 2,
    y: event.clientY - boundingRectangle.y,
  }
}
