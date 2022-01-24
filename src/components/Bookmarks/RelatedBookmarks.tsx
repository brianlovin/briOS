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
    <div className="mx-auto mb-4 w-full max-w-3xl px-4 md:mb-8 md:px-8">
      <div className="rounded-md border border-t border-gray-150 bg-gray-100 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-quaternary py-2 text-xs font-medium uppercase leading-snug">
          {related.length} more from {bookmark.host}
        </p>
        <ul>
          {related.map((r) => (
            <li key={r.node.id}>
              <Link href="/bookmarks/[id]" as={`/bookmarks/${r.node.id}`}>
                <a
                  onClick={handleClick}
                  className="text-primary -mx-2 flex justify-between rounded-md px-2 py-2 font-medium line-clamp-1 hover:bg-gray-200 dark:hover:bg-gray-700 md:-mx-3 md:px-3"
                >
                  <span>{r.node.title}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
