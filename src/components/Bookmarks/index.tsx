import * as React from 'react'
import { useGetBookmarksQuery } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import LoadingSpinner from '~/components/LoadingSpinner'
import FullscreenLoading from '~/components/FullscreenLoading'
import Button from '~/components/Button'
import ListContainer from '~/components/ListDetail/ListContainer'
import TitleBar from '~/components/ListDetail/TitleBar'
import ListItem from '~/components/ListDetail/ListItem'
import { useRouter } from 'next/router'

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

  const router = useRouter()

  return (
    <ListContainer>
      <TitleBar title="Bookmarks" />

      <div className="lg:p-3 lg:space-y-1">
        {bookmarks.map((bookmark, index) => {
          const active = router.query?.id === bookmark.id
          return (
            <ListItem
              key={bookmark.id}
              title={bookmark.title}
              description={bookmark.notes}
              byline={bookmark.host}
              active={active}
              href="/bookmarks/[id]"
              as={`/bookmarks/${bookmark.id}`}
            />
          )
        })}
        {showLoadMore && (
          <Button className="w-full" onClick={handleLoadMore}>
            {loading ? <LoadingSpinner /> : 'Load more'}
          </Button>
        )}
      </div>
    </ListContainer>
  )
}
