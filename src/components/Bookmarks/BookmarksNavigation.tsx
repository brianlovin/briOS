import * as React from 'react'
import Link from 'next/link'
import { Bookmark, BookOpen, Compass, Star } from 'react-feather'
import { useRouter } from 'next/router'

export default function BookmarksNavigation() {
  const router = useRouter()
  const { category } = router.query

  function isActive(path) {
    return category === path
  }

  return (
    <div className="flex items-center -ml-4 -mr-10 overflow-x-auto border-b border-gray-300 dark:border-gray-700 md:justify-center tabbed-navigation md:-ml-0 md:-mr-0 flex-nowrap">
      <Link href="/bookmarks">
        <a
          className={`tab ${
            isActive(undefined) ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <span className="flex items-center px-5 py-3 space-x-2">
            <Bookmark size={16} />
            <span>All</span>
          </span>
        </a>
      </Link>

      <Link href="/bookmarks/[category]" as={`/bookmarks/reading`}>
        <a
          className={`tab ${
            isActive('reading') ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <span className="flex items-center px-5 py-3 space-x-2">
            <BookOpen size={16} />
            <span>Reading</span>
          </span>
        </a>
      </Link>

      <Link href="/bookmarks/[category]" as={`/bookmarks/portfolio`}>
        <a
          className={`tab ${
            isActive('portfolio') ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <span className="flex items-center px-5 py-3 space-x-2">
            <Star size={16} />
            <span>Portfolios</span>
          </span>
        </a>
      </Link>

      <Link href="/bookmarks/[category]" as={`/bookmarks/website`}>
        <a
          className={`tab ${
            isActive('website') ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <span className="flex items-center px-5 py-3 space-x-2">
            <Compass size={16} />
            <span>Personal Sites</span>
          </span>
        </a>
      </Link>
    </div>
  )
}
