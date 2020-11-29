import * as React from 'react'

export function CenteredColumn({ children }) {
  return (
    <div className="flex flex-col max-w-screen-sm mx-auto justify-content">
      {children}
    </div>
  )
}
