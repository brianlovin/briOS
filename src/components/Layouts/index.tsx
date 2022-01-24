import * as React from 'react'

import { Sidebar } from '~/components/Sidebar'

interface Props {
  list: React.ReactElement | null
  detail: React.ReactElement | null
  hasDetail?: boolean
}

export function ListDetailView({ list, detail, hasDetail = false }: Props) {
  return (
    <div className="flex w-full">
      {list && (
        <div
          id="list"
          className={`bg-dots ${
            hasDetail ? 'hidden lg:flex' : 'w-full min-h-screen'
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
    <div className="relative flex w-full h-full min-h-screen">
      <Sidebar />

      <div className="flex flex-1">{children}</div>
    </div>
  )
}
