import * as React from 'react'
import { useGetBookmarksQuery } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import { BookmarkListItem } from './BookmarkListItem'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import LoadingSpinner from '../LoadingSpinner'
import FullscreenLoading from '../FullscreenLoading'
import Button from '../Button'

export default function BookmarksList({ category = undefined }) {
  const { isMe } = useAuth()
  const [showLoadMore, setShowLoadMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setShowLoadMore(true)
  }, [category])

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
    <div className="w-full space-y-6 timeline-container">
      {bookmarks.map((bookmark, index) => (
        <BookmarkListItem
          editable={isMe}
          key={`${bookmark.url}-${index}`}
          bookmark={bookmark}
        />
      ))}
      {showLoadMore && (
        <Button className="w-full" onClick={handleLoadMore}>
          {loading ? <LoadingSpinner /> : 'Load more'}
        </Button>
      )}
    </div>
  )
}
