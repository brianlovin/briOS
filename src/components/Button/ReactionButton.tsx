import * as React from 'react'

import Button from '~/components/Button'
import { useViewerQuery } from '~/graphql/types.generated'

import { HeartFillIcon, HeartIcon } from '../Icon'
import { SignInDialog } from '../SignInDialog'

interface Props {
  id: string // used to reset the button state as the user switches between pages
  hasReacted: boolean
  count: number
  onClick: () => void
  loading: boolean
}

export function ReactionButton(props: Props) {
  const { id, onClick, hasReacted, count, loading } = props

  const { data } = useViewerQuery()
  const [hasReactedState, setHasReactedState] = React.useState(hasReacted)
  let currCount = count
  let nextCount = hasReactedState ? count - 1 : count + 1
  const [currTranslate, setCurrTranslate] = React.useState(
    hasReactedState ? '-translate-y-4' : 'translate-y-0'
  )
  const [nextTranslate, setNextTranslate] = React.useState(
    hasReactedState ? 'translate-y-0' : '-translate-y-4'
  )
  let currOpacity = 'opacity-100'
  let nextOpacity = 'opacity-0'
  const [ping, setPing] = React.useState(false)

  // reset all the states as people navigate between different reactable pages
  React.useEffect(() => {
    setHasReactedState(hasReacted)
    currCount = count
    nextCount = hasReacted ? count - 1 : count + 1
    setCurrTranslate(hasReacted ? '-translate-y-4' : 'translate-y-0')
    setNextTranslate(hasReacted ? 'translate-y-0' : '-translate-y-4')
  }, [id, hasReacted])

  if (!data?.viewer) {
    return (
      <SignInDialog
        trigger={
          <Button aria-label="Like">
            <span className="text-gray-500">
              <HeartIcon />
            </span>
            <span>{count}</span>
          </Button>
        }
      />
    )
  }

  function handleClick() {
    if (loading) return
    setCurrTranslate(nextTranslate)
    setNextTranslate(currTranslate)
    setHasReactedState(!hasReactedState)
    if (!hasReactedState) {
      setPing(true)
      setTimeout(() => setPing(false), 700)
    }
    onClick()
  }

  return (
    <Button
      aria-label={hasReactedState ? 'Unlike' : 'Like'}
      onClick={handleClick}
      style={{ maxHeight: '32px', overflow: 'hidden' }}
    >
      {hasReactedState ? (
        <span className="relative text-red-500">
          {ping && (
            <span className="absolute top-0 left-0 animate-ping">
              <HeartFillIcon />
            </span>
          )}
          <HeartFillIcon />
        </span>
      ) : (
        <span className="text-gray-500">
          <HeartIcon />
        </span>
      )}
      <div className="relative -top-px h-3">
        <div
          className={`flex flex-col items-center justify-center space-y-2 duration-300 ${currTranslate} transform transition-all`}
        >
          {hasReactedState ? (
            <>
              <span
                className={`h-2 transition-all duration-300 ${nextOpacity}`}
              >
                {nextCount}
              </span>
              <span
                className={`h-2 transition-all duration-300 ${currOpacity}`}
              >
                {currCount}
              </span>
            </>
          ) : (
            <>
              <span
                className={`h-2 transition-all duration-300 ${currOpacity}`}
              >
                {currCount}
              </span>
              <span
                className={`h-2 transition-all duration-300 ${nextOpacity}`}
              >
                {nextCount}
              </span>
            </>
          )}
        </div>
      </div>
    </Button>
  )
}
