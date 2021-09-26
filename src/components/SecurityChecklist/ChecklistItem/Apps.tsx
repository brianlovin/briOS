import * as React from 'react'
import type { ChecklistResource } from '../types'
import { AppRow } from './App'

type Props = {
  resource: ChecklistResource
}

export const Apps = ({ resource }: Props) => {
  if (!resource.apps) return null

  const appList = resource.apps

  return (
    <div className="-mx-4 overflow-hidden border md:rounded-lg shadow-subtle border-gray-150">
      <p className="p-4 text-sm font-medium tracking-wider uppercase text-tertiary">
        Apps
      </p>
      {appList && appList.map((app) => <AppRow key={app.name} app={app} />)}
    </div>
  )
}
