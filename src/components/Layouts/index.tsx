import * as React from 'react'
import Sidebar from '../Sidebar'

export function CenteredColumn({ children }) {
  return (
    <div className="max-w-screen-sm mx-auto justify-content">{children}</div>
  )
}

export function ListDetailView({ list, detail }) {
  return (
    <div className="flex w-full">
      {list && (
        <div
          className={`bg-dots ${
            detail ? 'hidden md:flex' : 'w-full min-h-screen'
          }`}
        >
          {list}
        </div>
      )}
      {detail}
    </div>
  )
}

export function SiteLayout({ children }) {
  return (
    <div className="relative flex w-full h-full">
      <Sidebar />

      <div className="flex flex-1">{children}</div>
    </div>
  )
}
