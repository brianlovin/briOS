import * as React from 'react'

export function CenteredColumn({ children }) {
  return (
    <div className="max-w-screen-sm mx-auto justify-content">{children}</div>
  )
}

export function ListViewOnly({ list }) {
  return (
    <div className="flex w-full">
      {list}
      <div className="w-full min-h-screen" />
    </div>
  )
}

export function ListDetailView({ list, detail }) {
  return (
    <div className="flex w-full">
      <div className="hidden md:flex">{list}</div>
      {detail}
    </div>
  )
}

export function DetailViewOnly({ children }) {
  return <div className="flex w-full">{children}</div>
}
