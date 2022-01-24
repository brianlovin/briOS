import * as React from 'react'

import type { ChecklistResource } from '../types'
import { ResourceRow } from './Resource'

type Props = {
  resource: ChecklistResource
}

export function Resources({ resource }: Props) {
  if (!resource.resources) return null
  return (
    <div className="-mx-4 overflow-hidden border border-gray-150 pb-4 shadow-subtle dark:border-gray-800 dark:bg-gray-900 md:rounded-lg">
      <h3 className="text-secondary p-4 text-sm font-semibold uppercase tracking-wider">
        Resources
      </h3>
      <div className="space-y-3">
        {resource.resources.map((r) => (
          <ResourceRow key={r.name} resource={r} />
        ))}
      </div>
    </div>
  )
}
