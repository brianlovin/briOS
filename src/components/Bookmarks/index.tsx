import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import Grid from '~/components/Grid'
import { BookmarkListItem } from './BookmarkListItem'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import { Button } from '../Button'
import LoadingSpinner from '../LoadingSpinner'

interface Props {
  bookmarks?: Array<Bookmark>
  fetchMore: Function
}

export default function BookmarksList(props: Props) {
  const { fetchMore, bookmarks } = props
  const { isMe } = useAuth()
  const [showLoadMore, setShowLoadMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  function handleLoadMore() {
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

  if (!bookmarks || bookmarks.length === 0) return null

  return (
    <Grid gap={24}>
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
    </Grid>
  )
}
