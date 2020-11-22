import * as React from 'react'

export function CenteredColumn({ children }) {
  return (
    <div className="flex flex-col mx-auto justify-content max-w-screen-sm">
      {children}
    </div>
  )
}
