import * as React from 'react'

import type { ChecklistResource } from '../types'

type Props = {
  resource: ChecklistResource
}

export function Heading({ resource }: Props) {
  return (
    <h2 className="font-sans text-xl font-semibold text-primary">
      {resource.title}
    </h2>
  )
}
