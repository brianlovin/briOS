import * as React from 'react'
import type { ChecklistResource } from '../types'

type Props = {
  resource: ChecklistResource
}

export function Heading({ resource }: Props) {
  return (
    <p className="font-sans text-2xl font-bold text-primary">
      {resource.title}
    </p>
  )
}
