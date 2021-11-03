// source: https://github.com/jpalumickas/use-window-focus/blob/main/src/index.ts

import { useEffect, useState } from 'react'

const hasFocus = () => typeof document !== 'undefined' && document.hasFocus()

interface Props {
  onFocus?: () => void
  onBlur?: () => void
}

export function useWindowFocus({ onFocus = null, onBlur = null }: Props) {
  const [focused, setFocused] = useState(hasFocus) // Focus for first render

  useEffect(() => {
    setFocused(hasFocus()) // Focus for additional renders

    function handleFocus() {
      onFocus && onFocus()
      setFocused(true)
    }

    function handleBlur() {
      onBlur && onBlur()
      setFocused(false)
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return focused
}
