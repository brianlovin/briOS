import * as React from 'react'
import Link from 'next/link'

interface Props {
  title: string
  active: boolean
  href: string
  as: string
  description?: string | React.ReactElement
  byline?: string | React.ReactElement
  leadingAccessory?: React.ReactElement
  onClick?: (e: any) => void
}

export default function ListItem({
  title,
  description,
  byline,
  href,
  as,
  active,
  leadingAccessory,
  onClick,
}: Props) {
  return (
    <Link href={href} as={as}>
      <a
        onClick={onClick && onClick}
        className={`flex py-3 lg:py-2 px-3.5 space-x-3 border-b lg:border-none border-gray-100 dark:border-gray-900 text-sm lg:rounded-lg ${
          active
            ? 'bg-black dark:bg-gray-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-800'
        }`}
      >
        {leadingAccessory && <>{leadingAccessory}</>}
        <div className="flex flex-col justify-center space-y-1">
          <div
            className={`font-medium ${
              active ? 'text-white' : 'text-gray-1000 dark:text-gray-100'
            }`}
          >
            {title}
          </div>
          {description && (
            <div
              className={`line-clamp-2 ${
                active
                  ? 'text-white text-opacity-80'
                  : 'text-gray-1000 dark:text-white text-opacity-60'
              }`}
            >
              {description}
            </div>
          )}
          {byline && (
            <div
              className={`line-clamp-1 ${
                active
                  ? 'text-white text-opacity-60'
                  : 'text-gray-1000 dark:text-white text-opacity-40'
              }`}
            >
              {byline}
            </div>
          )}
        </div>
      </a>
    </Link>
  )
}
