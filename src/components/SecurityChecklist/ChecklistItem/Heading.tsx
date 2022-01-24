import * as React from 'react'

import type { ChecklistResource } from '../types'

type Props = {
  resource: ChecklistResource
}

export function Heading({ resource }: Props) {
  return (
    <h2 className="text-primary font-sans text-xl font-semibold">
      {resource.title}
    </h2>
  )
}
