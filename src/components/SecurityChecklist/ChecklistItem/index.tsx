import * as React from 'react'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'

import type { ChecklistResource } from '../types'
import { Apps } from './Apps'
import { Heading } from './Heading'
import { Resources } from './Resources'

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
          <MarkdownRenderer children={resource.description} />
        </div>
      </div>

      {resource.apps && <Apps resource={resource} />}

      {resource.resources && <Resources resource={resource} />}
    </div>
  )
}
