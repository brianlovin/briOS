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
    <div className="-mx-4 overflow-hidden border border-gray-150 shadow-subtle dark:border-gray-800 dark:bg-gray-900 md:rounded-lg">
      <h3 className="text-secondary p-4 text-sm font-semibold uppercase tracking-wider">
        Apps
      </h3>
      {appList && appList.map((app) => <AppRow key={app.name} app={app} />)}
    </div>
  )
}
