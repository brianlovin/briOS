import * as React from 'react'
import { Link } from 'react-feather'
import type { Resource } from '../types'

type Props = {
  resource: Resource
}

export const ResourceRow = ({ resource }: Props) => (
  <div className="block">
    <a
      href={resource.url}
      className="relative flex items-start px-4 space-x-2 text-tertiary hover:text-gray-1000 dark:hover:text-gray-50"
    >
      <Link size={12} className="flex-none transform translate-y-1.5" />
      <span>{resource.name}</span>
    </a>
  </div>
)
