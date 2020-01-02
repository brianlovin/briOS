import * as React from 'react';
import { Bookmark } from '~/types'
import { P } from '../Typography';
import { ListItem, Grid, Url, Title } from './style'

interface Props {
  bookmarks?: Array<Bookmark>
}

function BookmarkListItem({ bookmark }: { bookmark: Bookmark }) {
  return (
    <ListItem href={bookmark.url} target="_blank" rel="noopener noreferrer">
      <Title>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>

        {bookmark.title || bookmark.url}
      </Title>
      {bookmark.description && <P>{bookmark.description.slice(0, 140)}...</P>}
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