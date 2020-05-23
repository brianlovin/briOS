import * as React from 'react'
import { useGetBookmarksQuery } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import { BookmarkListItem } from './BookmarkListItem'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import { Button } from '../Button'
import LoadingSpinner from '../LoadingSpinner'
import FullscreenLoading from '../FullscreenLoading'
import Flex from '~/components/Flex'

export default function BookmarksList() {
  const { isMe } = useAuth()
  const [showLoadMore, setShowLoadMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  // pre-populate bookmarks from the cache, but check for any new ones after
  // the page loads
  const { data, fetchMore, error } = useGetBookmarksQuery()

  // this can happen if the route is navigated to from the client or if the
  // cache fails to populate for whatever reason
  if (!data || !data.bookmarks) return <FullscreenLoading />
  if (error) return null

  const { bookmarks } = data

  console.log({ bookmarks, length: bookmarks.length })

  function handleLoadMore() {
    console.log('handle load more', fetchMore)
    if (loading) return
    console.log('got past loading')

    setLoading(true)

    try {
      console.log('trying to fetch more')
      fetchMore({
        variables: {
          skip: bookmarks.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          console.log('update query')
          setLoading(false)

          console.log({ fetchMoreResult })

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
      console.log({ err })
      setLoading(false)
    }
  }

  return (
    <Flex flexDirection="column" gap={24}>
      {bookmarks.map((bookmark, index) => (
        <BookmarkListItem
          editable={isMe}
          key={`${bookmark.url}-${index}`}
          bookmark={bookmark}
        />
      ))}

      {showLoadMore && (
        <Button style={{ width: '100%' }} onClick={handleLoadMore}>
          {loading ? <LoadingSpinner size={16} /> : 'Show me more'}
        </Button>
      )}
    </Flex>
  )
}
