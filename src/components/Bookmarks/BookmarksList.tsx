import { AnimateSharedLayout, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Link } from 'react-feather'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { ListItem } from '~/components/ListDetail/ListItem'
import { useGetBookmarksQuery } from '~/graphql/types.generated'

import { BookmarksListItem } from './BookmarkListItem'
import { BookmarksTitlebar } from './BookmarksTitlebar'

export const BookmarksContext = React.createContext({
  tagFilter: null,
  setTagFilter: (name: string) => {},
})

export function BookmarksList() {
  const router = useRouter()
  const { tag } = router.query
  const [tagFilter, setTagFilter] = React.useState(tag)
  const [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const defaultContextValue = {
    tagFilter,
    setTagFilter,
  }

  React.useEffect(() => {
    if (tag) router.push(router.pathname, { query: null })
  }, [tag])

  const { data, error, loading } = useGetBookmarksQuery()

  if (loading) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <div />
      </ListContainer>
    )
  }

  if (error) return null

  const { bookmarks } = data

  return (
    <BookmarksContext.Provider value={defaultContextValue}>
      <ListContainer data-cy="bookmarks-list" onRef={setScrollContainerRef}>
        <BookmarksTitlebar scrollContainerRef={scrollContainerRef} />
        <AnimateSharedLayout>
          <div className="lg:p-3 lg:space-y-1">
            {bookmarks
              .filter((b) =>
                tagFilter ? b.tags.some((t) => t.name === tagFilter) : true
              )
              .map((bookmark) => {
                const active = router.query.id === bookmark.id
                return (
                  <motion.div layout key={bookmark.id}>
                    <BookmarksListItem active={active} bookmark={bookmark} />
                  </motion.div>
                )
              })}
          </div>
        </AnimateSharedLayout>
      </ListContainer>
    </BookmarksContext.Provider>
  )
}