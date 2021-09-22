import * as React from 'react'

export default function ListContainer({ children, onRef }) {
  const scrollContainerRef = React.useRef(null)

  React.useEffect(() => {
    onRef(scrollContainerRef)
  }, [scrollContainerRef])

  return (
    <div
      ref={scrollContainerRef}
      className="relative flex-none w-full h-full max-h-screen min-h-screen overflow-y-auto bg-white border-r border-gray-150 md:w-72 xl:w-96 dark:bg-gray-900 dark:border-gray-800"
    >
      {children}
    </div>
  )
}
