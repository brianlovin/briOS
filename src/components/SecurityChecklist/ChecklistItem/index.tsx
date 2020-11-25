import * as React from 'react'
import type { ChecklistResource } from '../types'
import { Heading } from './Heading'
import { Apps } from './Apps'
import { Resources } from './Resources'
import MarkdownRenderer from '~/components/MarkdownRenderer'

type Props = {
  resource: ChecklistResource
}

export default function ChecklistItem(props: Props) {
  const { resource } = props

  return (
    <div className="flex flex-col p-6 pb-4 space-y-6 bg-white rounded-lg shadow dark:bg-gray-900">
      <div>
        <Heading resource={resource} />

        <div className="mt-3 prose-sm prose">
          <MarkdownRenderer>{resource.description}</MarkdownRenderer>
        </div>
      </div>

      {resource.apps && (
        <>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
          <Apps resource={resource} />
        </>
      )}

      {resource.resources && (
        <>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
          <Resources resource={resource} />
        </>
      )}
    </div>
  )
}
