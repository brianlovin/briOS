import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import Grid from '~/components/Grid'
import BookmarkListItem from './BookmarkListItem'

interface Props {
  bookmarks?: Array<Bookmark>
}

export default function BookmarksList({ bookmarks }: Props) {
  const { isMe } = useAuth()

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
    </Grid>
  )
}
