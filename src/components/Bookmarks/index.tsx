import * as React from 'react';
import FlipMove from 'react-flip-move'
import { Bookmark } from '~/types'
import { ListItem, Grid, Title } from './style'
import { Small } from '../Typography';

interface Props {
  bookmarks?: Array<Bookmark>
}

// this has to be a Class component to interface properly with FlipMove
class BookmarkListItem extends React.Component<{ bookmark: Bookmark }> {
  render() {
    const { bookmark } = this.props
    return (
      <ListItem href={`${bookmark.url}?ref=brianlovin.com`} target="_blank" rel="noopener noreferrer">
        <Title>
          {bookmark.title || bookmark.url}
        </Title>
        <Small>{bookmark.host || bookmark.url}</Small>
      </ListItem>
    )
  }
}

export default function BookmarksList({ bookmarks }: Props) {
  if (!bookmarks || bookmarks.length === 0) return null

  return (
    <Grid>
      <FlipMove enterAnimation={'accordionVertical'} leaveAnimation={false} typeName={null}>
        {bookmarks.map(bookmark => (
          <BookmarkListItem key={bookmark.url} bookmark={bookmark} />
        ))}
      </FlipMove>
    </Grid>
  )
}