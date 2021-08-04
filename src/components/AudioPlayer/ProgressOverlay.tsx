import * as React from 'react'

const ProgressOverlay = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute w-full h-full origin-left bg-white opacity-50 pointer-events-none dark:bg-gray-800 bg-blend-multiply z-1"
    />
  )
})

export default ProgressOverlay
