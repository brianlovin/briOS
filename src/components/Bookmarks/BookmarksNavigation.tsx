import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function BookmarksNavigation() {
  const router = useRouter()
  const { category } = router.query

  function isActive(path) {
    return category === path
  }

  const defaultClasses = `flex flex-none rounded text-primary items-center justify-center space-x-3`
  const activeClasses = `bg-gray-1000 bg-opacity-5 dark:bg-white text-primary`
  const inactiveClasses = `hover:bg-gray-900 filter-saturate hover:bg-opacity-5 dark:hover:bg-white dark:text-white  hover:text-gray-1000 dark:hover:text-gray-100 text-tertiary`

  return (
    <div className="hidden grid-cols-4 gap-2 overflow-x-auto md:grid tabbed-navigation md:justify-center md:-ml-0 md:-mr-0 flex-nowrap">
      <Link href="/bookmarks">
        <a
          className={`${defaultClasses} ${
            isActive(undefined) ? activeClasses : inactiveClasses
          }`}
        >
          <span className="flex items-center px-4 py-2 space-x-2">
            <span>All</span>
          </span>
        </a>
      </Link>

      <Link href="/bookmarks/[category]" as={`/bookmarks/reading`}>
        <a
          className={`${defaultClasses} ${
            isActive('reading') ? activeClasses : inactiveClasses
          }`}
        >
          <span className="flex items-center px-4 py-2 space-x-2">
            <span>Reading</span>
          </span>
        </a>
      </Link>

      <Link href="/bookmarks/[category]" as={`/bookmarks/portfolio`}>
        <a
          className={`${defaultClasses} ${
            isActive('portfolio') ? activeClasses : inactiveClasses
          }`}
        >
          <span className="flex items-center px-4 py-2 space-x-2">
            <span>Portfolios</span>
          </span>
        </a>
      </Link>

      <Link href="/bookmarks/[category]" as={`/bookmarks/website`}>
        <a
          className={`${defaultClasses} ${
            isActive('website') ? activeClasses : inactiveClasses
          }`}
        >
          <span className="flex items-center px-4 py-2 space-x-2">
            <span>Websites</span>
          </span>
        </a>
      </Link>
    </div>
  )
}
