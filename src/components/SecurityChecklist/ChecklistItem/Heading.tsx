import * as React from 'react'
import type { ChecklistResource } from '../types'

type Props = {
  resource: ChecklistResource
}

export function Heading({ resource }: Props) {
  return (
    <p className="font-sans text-xl font-semibold text-primary">
      {resource.title}
    </p>
  )
}
