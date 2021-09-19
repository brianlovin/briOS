import * as React from 'react'

export default function ListContainer({ children }) {
  return (
    <div className="relative flex-none w-full h-full max-h-screen min-h-screen overflow-y-auto bg-white border-r border-gray-200 md:w-72 xl:w-96 dark:bg-gray-900 dark:border-gray-800">
      {children}
    </div>
  )
}
