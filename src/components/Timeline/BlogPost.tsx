import * as React from 'react'
import Link from 'next/link'
import { TimelineEntry } from './Entry'
import { Edit2 } from 'react-feather'

interface Props {
  slug: string
  title: string
  description: string
  timestamp: string
  divider?: boolean
}

export function BlogPost({
  slug,
  title,
  description,
  timestamp,
  divider = true,
}: Props) {
  return (
    <TimelineEntry
      title="Published new post"
      tint="green"
      Icon={Edit2}
      timestamp={timestamp}
      divider={divider}
    >
      <Link passHref href={`/overthought/${slug}`}>
        <a className="px-4 py-3 transition-shadow bg-white rounded-md shadow dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="font-semibold">{title}</p>
              <p className="font-normal text-tertiary">{description}</p>
            </div>
          </div>
        </a>
      </Link>
    </TimelineEntry>
  )
}
