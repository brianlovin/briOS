import * as React from 'react'

export function ListContainer({ children, onRef, ...rest }) {
  const scrollContainerRef = React.useRef(null)

  React.useEffect(() => {
    onRef(scrollContainerRef)
  }, [scrollContainerRef])

  return (
    <div
      ref={scrollContainerRef}
      className="relative h-full max-h-screen min-h-screen w-full flex-none overflow-y-auto border-r border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-80 lg:bg-gray-50 lg:dark:bg-gray-900 xl:w-96"
      {...rest}
    >
      {children}
    </div>
  )
}
