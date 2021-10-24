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
    <div className="-mx-4 overflow-hidden border md:rounded-lg shadow-subtle dark:border-gray-800 dark:bg-gray-900 border-gray-150">
      <p className="p-4 text-sm font-semibold tracking-wider uppercase text-secondary">
        Apps
      </p>
      {appList && appList.map((app) => <AppRow key={app.name} app={app} />)}
    </div>
  )
}
