import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import { Small, A } from '~/components/Typography'
import Grid from '~/components/Grid'
import EditingBookmarkListItem from './EditingBookmarkListItem'
import BookmarkReaction from './BookmarkReaction'

interface Props {
  editable: boolean
  bookmark: Bookmark
}

export const BookmarkListItem = React.memo((props: Props) => {
  const { bookmark, editable } = props
  const [isEditing, setIsEditing] = React.useState(false)

  if (isEditing) {
    return (
      <EditingBookmarkListItem
        onDone={() => setIsEditing(false)}
        bookmark={bookmark}
      />
    )
  }

  return (
    <Grid gap={bookmark.notes ? 8 : 4}>
      <A
        href={`${bookmark.url}?ref=brianlovin.com`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {bookmark.title || bookmark.url}
      </A>
      {bookmark.notes && (
        <Grid style={{ alignItems: 'start' }} columns={'1fr'}>
          <Small
            style={{
              borderLeft: '2px solid var(--border-primary)',
              paddingLeft: '12px',
            }}
          >
            {bookmark.notes}
          </Small>
        </Grid>
      )}
      <Grid columns={`repeat(5, min-content)`} gap={12}>
        <BookmarkReaction bookmark={bookmark} />

        <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>

        <A
          href={`https://${bookmark.host}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Small>{bookmark.host || bookmark.url}</Small>
        </A>

        {editable && (
          <React.Fragment>
            <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>

            <Small
              style={{ cursor: 'pointer' }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Small>
          </React.Fragment>
        )}
      </Grid>
    </Grid>
  )
})
