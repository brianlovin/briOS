import Link from 'next/link'
import * as React from 'react'

import { useGetBookmarksQuery } from '~/graphql/types.generated'

export function RelatedBookmarks({ bookmark }) {
  const { data, loading } = useGetBookmarksQuery()

  if (loading) return null

  const { bookmarks } = data
  const { host, url } = bookmark
  const related = bookmarks.filter((b) => b.host === host && b.url !== url)

  if (related.length === 0) return null

  function handleClick(e) {
    if (e.metaKey) {
      e.preventDefault()
      e.stopPropagation()
      window.open(bookmark.url, '_blank').focus()
    }
  }

  return (
    <div className="w-full max-w-3xl px-4 pt-6 pb-4 mx-auto mb-0 bg-gray-100 border-t rounded-none xl:pt-8 xl:pb-6 xl:border xl:rounded-md xl:mb-8 border-gray-150 dark:border-gray-800 dark:bg-gray-900 md:px-8">
      <p className="pb-2 text-xs font-medium leading-snug uppercase text-quaternary">
        {related.length} more from {bookmark.host}
      </p>
      <ul>
        {related.map((r) => (
          <li>
            <Link href="/bookmarks/[id]" as={`/bookmarks/${r.id}`}>
              <a
                onClick={handleClick}
                className="flex justify-between px-2 py-2 -mx-2 font-medium rounded-md text-primary md:-mx-3 md:px-3 line-clamp-1 dark:hover:bg-gray-700 hover:bg-gray-200"
              >
                <span>{r.title}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
