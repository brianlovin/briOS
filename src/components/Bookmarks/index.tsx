import * as React from 'react'
import { useGetBookmarksQuery } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import { BookmarkListItem } from './BookmarkListItem'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import LoadingSpinner from '../LoadingSpinner'
import FullscreenLoading from '../FullscreenLoading'

export default function BookmarksList({ category }) {
  const { isMe } = useAuth()
  const [showLoadMore, setShowLoadMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  // pre-populate bookmarks from the cache, but check for any new ones after
  // the page loads
  const { data, fetchMore, error } = useGetBookmarksQuery({
    variables: { category },
  })

  // this can happen if the route is navigated to from the client or if the
  // cache fails to populate for whatever reason
  if (!data || !data.bookmarks) return <FullscreenLoading />
  if (error) return null

  const { bookmarks } = data

  function handleLoadMore() {
    if (loading) return

    setLoading(true)

    try {
      fetchMore({
        variables: {
          skip: bookmarks.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          setLoading(false)

          if (!fetchMoreResult) return prev

          if (fetchMoreResult.bookmarks.length < PAGINATION_AMOUNT) {
            // at the end of the list
            setShowLoadMore(false)
          }

          return Object.assign({}, prev, {
            bookmarks: [...prev.bookmarks, ...fetchMoreResult.bookmarks],
          })
        },
      })
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full timeline-container">
      {bookmarks.map((bookmark, index) => (
        <BookmarkListItem
          editable={isMe}
          key={`${bookmark.url}-${index}`}
          bookmark={bookmark}
          divider={index !== bookmarks.length - 1}
        />
      ))}
      {showLoadMore && (
        <button className="mt-4 btn" onClick={handleLoadMore}>
          {loading ? <LoadingSpinner /> : 'Show me more'}
        </button>
      )}
    </div>
  )
}
