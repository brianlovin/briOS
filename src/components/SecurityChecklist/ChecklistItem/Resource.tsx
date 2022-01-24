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
      className="relative flex items-start space-x-2 px-4 text-gray-700 hover:text-gray-1000 dark:text-gray-400 dark:hover:text-gray-50"
    >
      <Link size={12} className="flex-none translate-y-1.5 transform" />
      <span>{resource.name}</span>
    </a>
  </div>
)
