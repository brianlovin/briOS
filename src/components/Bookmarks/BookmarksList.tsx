import { LayoutGroup, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import { useGetBookmarksQuery } from '~/graphql/types.generated'

import { ListLoadMore } from '../ListDetail/ListLoadMore'
import { LoadingSpinner } from '../LoadingSpinner'
import { BookmarksListItem } from './BookmarkListItem'
import { BookmarksTitlebar } from './BookmarksTitlebar'

export const BookmarksContext = React.createContext({
  tag: null,
  setTag: (tag: string) => {},
})

export function BookmarksList() {
  const router = useRouter()
  const tagQuery = router.query?.tag as string
  const [tag, setTag] = React.useState(tagQuery)
  const [isVisible, setIsVisible] = React.useState(false)
  const [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const variables = tag
    ? {
        first: PAGINATION_AMOUNT,
        after: null,
        filter: { tag: tag },
      }
    : null
  const { data, error, loading, fetchMore } = useGetBookmarksQuery({
    variables,
  })

  const defaultContextValue = {
    tag,
    setTag,
  }

  function handleFetchMore() {
    return fetchMore({
      variables: {
        ...variables,
        after: data.bookmarks.pageInfo.endCursor,
      },
    })
  }

  // scroll to the top of the list whenever the filters are changed
  React.useEffect(() => {
    if (scrollContainerRef?.current) scrollContainerRef.current.scrollTo(0, 0)
  }, [tag])

  React.useEffect(() => {
    if (isVisible) handleFetchMore()
  }, [isVisible])

  // if a user is linked to /bookmarks?tag=foo, clear the query filter but stay on the same page
  React.useEffect(() => {
    if (tagQuery) router.push(router.pathname, { query: null })
  }, [tagQuery])

  if (loading && !data?.bookmarks) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <BookmarksTitlebar scrollContainerRef={scrollContainerRef} />
        <div className="flex items-center justify-center flex-1">
          <LoadingSpinner />
        </div>
      </ListContainer>
    )
  }

  if (error) return null

  const { bookmarks } = data

  return (
    <BookmarksContext.Provider value={defaultContextValue}>
      <ListContainer data-cy="bookmarks-list" onRef={setScrollContainerRef}>
        <BookmarksTitlebar scrollContainerRef={scrollContainerRef} />
        <LayoutGroup>
          <div className="lg:p-3 lg:space-y-1">
            {bookmarks.edges.map((bookmark) => {
              const active = router.query.id === bookmark.node.id
              return (
                <motion.div layout key={bookmark.node.id}>
                  <BookmarksListItem active={active} bookmark={bookmark.node} />
                </motion.div>
              )
            })}
          </div>

          {bookmarks.pageInfo.hasNextPage && (
            <ListLoadMore setIsVisible={setIsVisible} />
          )}
        </LayoutGroup>
      </ListContainer>
    </BookmarksContext.Provider>
  )
}
