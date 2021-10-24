import * as React from 'react'
import type { ChecklistResource } from '../types'
import { Heading } from './Heading'
import { Apps } from './Apps'
import { Resources } from './Resources'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'

type Props = {
  resource: ChecklistResource
}

export function ChecklistItem(props: Props) {
  const { resource } = props

  return (
    <div className="space-y-8">
      <div>
        <Heading resource={resource} />

        <div className="mt-3 prose prose-lg">
          <MarkdownRenderer>{resource.description}</MarkdownRenderer>
        </div>
      </div>

      {resource.apps && <Apps resource={resource} />}

      {resource.resources && <Resources resource={resource} />}
    </div>
  )
}
