import * as React from 'react'
import ListContainer from '~/components/ListDetail/ListContainer'
import ListItem from '~/components/ListDetail/ListItem'
import { useRouter } from 'next/router'
import { BookmarksTitlebar } from './BookmarksTitlebar'
import { useGetBookmarksQuery } from '~/graphql/types.generated'
import { AnimateSharedLayout, motion } from 'framer-motion'

export default function BookmarksList() {
  const router = useRouter()
  const [scrollContainerRef, setScrollContainerRef] = React.useState(null)

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
    <ListContainer onRef={setScrollContainerRef}>
      <BookmarksTitlebar scrollContainerRef={scrollContainerRef} />

      <AnimateSharedLayout>
        <div className="lg:p-3 lg:space-y-1">
          {bookmarks.map((bookmark) => {
            const active = router.query?.id === bookmark.id
            return (
              <motion.div layout key={bookmark.id}>
                <ListItem
                  key={bookmark.id}
                  title={bookmark.title}
                  byline={bookmark.host}
                  active={active}
                  href="/bookmarks/[id]"
                  as={`/bookmarks/${bookmark.id}`}
                />
              </motion.div>
            )
          })}
        </div>
      </AnimateSharedLayout>
    </ListContainer>
  )
}
