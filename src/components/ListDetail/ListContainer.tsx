import * as React from 'react'

export function ListContainer({ children, onRef, ...rest }) {
  const scrollContainerRef = React.useRef(null)

  React.useEffect(() => {
    onRef(scrollContainerRef)
  }, [scrollContainerRef])

  return (
    <div
      ref={scrollContainerRef}
      className="relative flex-none w-full h-full max-h-screen min-h-screen overflow-y-auto bg-white border-r lg:bg-gray-50 border-gray-150 lg:w-80 xl:w-96 lg:dark:bg-gray-900 dark:bg-gray-900 dark:border-gray-800"
      {...rest}
    >
      {children}
    </div>
  )
}
