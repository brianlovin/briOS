import * as React from 'react';
import { Bookmark } from '~/types'
import { ListItem, Grid, Url, Title } from './style'

interface Props {
  bookmarks?: Array<Bookmark>
}

function BookmarkListItem({ bookmark }: { bookmark: Bookmark }) {
  return (
    <ListItem href={`${bookmark.url}?ref=brianlovin.com`} target="_blank" rel="noopener noreferrer">
      <Title>
        {bookmark.title || bookmark.url}
      </Title>
      <Url>{bookmark.host || bookmark.url}</Url>
    </ListItem>
  )
}

export default function BookmarksList({ bookmarks }: Props) {
  if (bookmarks.length === 0) return null

  return (
    <Grid>
      {bookmarks.map(bookmark => (
        <BookmarkListItem key={bookmark.url} bookmark={bookmark} />
      ))}
    </Grid>
  )
}