import * as React from 'react'

import type { ChecklistResource } from '../types'
import { ResourceRow } from './Resource'

type Props = {
  resource: ChecklistResource
}

export function Resources({ resource }: Props) {
  if (!resource.resources) return null
  return (
    <div className="pb-4 -mx-4 overflow-hidden border md:rounded-lg dark:bg-gray-900 dark:border-gray-800 shadow-subtle border-gray-150">
      <h3 className="p-4 text-sm font-semibold tracking-wider uppercase text-secondary">
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
