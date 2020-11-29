import * as React from 'react'
import { Link } from 'react-feather'
import type { Resource } from '../types'

type Props = {
  resource: Resource
}

export const ResourceRow = ({ resource }: Props) => (
  <a
    href={resource.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center px-4 py-3 -mx-3 space-x-3 font-normal text-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
  >
    <Link
      className="flex-shrink-0 text-gray-800 dark:text-gray-400"
      size={16}
    />
    <p className="flex-grow-0 flex-shrink">{resource.name}</p>
  </a>
)
