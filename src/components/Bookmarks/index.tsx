import * as React from 'react';
import { Bookmark } from '~/types'
import { P } from '../Typography';
import { Container, Grid, Url, Title } from './style'

interface Props {
  bookmarks?: Array<Bookmark>
}

function BookmarkListItem({ bookmark }: { bookmark: Bookmark }) {
  return (
    <Container href={bookmark.url} target="_blank" rel="noopener noreferrer">
      <Title>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>

        {bookmark.title || bookmark.url}
      </Title>
      {bookmark.description && <P>{bookmark.description.slice(0, 140)}...</P>}
      <Url>{bookmark.url}</Url>
    </Container>
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