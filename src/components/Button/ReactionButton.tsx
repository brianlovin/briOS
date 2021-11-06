import * as React from 'react'

import Button from '~/components/Button'
import { useViewerQuery } from '~/graphql/types.generated'

import { HeartFillIcon, HeartIcon } from '../Icon'
import { SignInDialog } from '../SignInDialog'

interface Props {
  hasReacted: boolean
  count: number
  onClick: () => void
  loading: boolean
}

export function ReactionButton({ onClick, hasReacted, count, loading }: Props) {
  const { data } = useViewerQuery()
  const [hasReactedState, setHasReactedState] = React.useState(hasReacted)
  const currCount = count
  const nextCount = hasReactedState ? count - 1 : count + 1
  const [currTranslate, setCurrTranslate] = React.useState(
    hasReactedState ? '-translate-y-4' : 'translate-y-0'
  )
  const [nextTranslate, setNextTranslate] = React.useState(
    hasReactedState ? 'translate-y-0' : '-translate-y-4'
  )
  const currOpacity = 'opacity-100'
  const nextOpacity = 'opacity-0'
  const [ping, setPing] = React.useState(false)

  if (!data?.viewer) {
    return (
      <SignInDialog
        trigger={
          <Button>
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
      <div className="relative h-3 -top-px">
        <div
          className={`flex space-y-2 duration-300 flex-col items-center justify-center ${currTranslate} transform transition-all`}
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
