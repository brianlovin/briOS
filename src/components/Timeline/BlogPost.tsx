import * as React from 'react'
import Link from 'next/link'
import { TimelineEntry } from './Entry'
import Image from 'next/image'

interface Props {
  slug: string
  title: string
  description: string
  timestamp: string
  image?: string
}

export function BlogPost({
  slug,
  title,
  description,
  timestamp,
  image,
}: Props) {
  return (
    <TimelineEntry title="Published new post" timestamp={timestamp}>
      <Link passHref href={`/writing/${slug}`}>
        <a className="px-4 py-3 transition-shadow bg-white rounded-md shadow dark:bg-gray-900 hover:shadow-cardHover">
          <div className="space-y-4 ">
            <div className="space-y-1 ">
              {image && (
                <div className="mb-3 -mt-3 -ml-4 -mr-4 overflow-hidden border-b border-gray-100 dark:border-gray-900 rounded-t-md">
                  <Image
                    src={`/static/img/writing/${image}`}
                    width={1012}
                    height={506}
                    layout="responsive"
                  />
                </div>
              )}
              <p className="font-semibold">{title}</p>
              <p className="font-normal text-tertiary">{description}</p>
            </div>
          </div>
        </a>
      </Link>
    </TimelineEntry>
  )
}
