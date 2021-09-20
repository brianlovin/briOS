import * as React from 'react'
import ListContainer from '~/components/ListDetail/ListContainer'
import ListItem from '~/components/ListDetail/ListItem'
import { useRouter } from 'next/router'
import { BookmarksTitlebar } from './Titlebar'

export default function BookmarksList({ bookmarks }) {
  const router = useRouter()

  return (
    <ListContainer>
      <BookmarksTitlebar />

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
