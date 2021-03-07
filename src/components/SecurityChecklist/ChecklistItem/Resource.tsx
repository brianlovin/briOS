import * as React from 'react'
import type { Resource } from '../types'

type Props = {
  resource: Resource
}

export const ResourceRow = ({ resource }: Props) => (
  <div className="block">
    <a
      href={resource.url}
      className="-mx-3 space-x-3 font-normal text-secondary highlight-link-hover"
    >
      <p className="inline font-medium ">· {resource.name}</p>
    </a>
  </div>
)
