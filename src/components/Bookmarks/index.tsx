import * as React from 'react'
import ListContainer from '~/components/ListDetail/ListContainer'
import ListItem from '~/components/ListDetail/ListItem'
import { useRouter } from 'next/router'
import { BookmarksTitlebar } from './BookmarksTitlebar'
import { useGetBookmarksQuery } from '~/graphql/types.generated'

export default function BookmarksList() {
  const router = useRouter()
  const [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const { data, error } = useGetBookmarksQuery({
    variables: { category: undefined },
  })

  if (!data || !data.bookmarks) return <p>loading...</p>
  if (error) return null

  const { bookmarks } = data

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <BookmarksTitlebar scrollContainerRef={scrollContainerRef} />

      <div className="lg:p-3 lg:space-y-1">
        {bookmarks.map((bookmark) => {
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
      </div>
    </ListContainer>
  )
}
