import Link from 'next/link'
import * as React from 'react'

import { useGetBookmarksQuery } from '~/graphql/types.generated'

export function RelatedBookmarks({ bookmark }) {
  const { data, loading } = useGetBookmarksQuery({
    variables: { filter: { host: bookmark.host } },
  })

  if (loading) return null

  const { bookmarks } = data
  const { host, url } = bookmark
  const related = bookmarks.edges.filter(
    (b) => b.node.host === host && b.node.url !== url
  )

  if (related.length === 0) return null

  function handleClick(e) {
    if (e.metaKey) {
      e.preventDefault()
      e.stopPropagation()
      window.open(bookmark.url, '_blank').focus()
    }
  }

  return (
    <div className="w-full max-w-3xl px-4 mx-auto mb-4 md:mb-8 md:px-8">
      <div className="px-6 py-4 bg-gray-100 border border-t rounded-md border-gray-150 dark:border-gray-800 dark:bg-gray-900">
        <p className="py-2 text-xs font-medium leading-snug uppercase text-quaternary">
          {related.length} more from {bookmark.host}
        </p>
        <ul>
          {related.map((r) => (
            <li key={r.node.id}>
              <Link
                href="/bookmarks/[id]"
                as={`/bookmarks/${r.node.id}`}
                onClick={handleClick}
                className="flex justify-between px-2 py-2 -mx-2 font-medium rounded-md text-primary line-clamp-1 hover:bg-gray-200 dark:hover:bg-gray-700 md:-mx-3 md:px-3"
              >
                <span>{r.node.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
