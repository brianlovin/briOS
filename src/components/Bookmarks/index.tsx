import * as React from 'react'
import {
  Bookmark,
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { ListItem, Title } from './style'
import { Small } from '../Typography'
import { useAuth } from '~/hooks/useAuth'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input } from '../Overthought/Feedback/style'
import Grid from '~/components/Grid'

interface Props {
  bookmarks?: Array<Bookmark>
}

interface ListItemProps extends Props {
  editable: boolean
  bookmark: Bookmark
}

function BookmarkListItem(props: ListItemProps) {
  const { bookmark, editable } = props

  const [title, setTitle] = React.useState(bookmark.title)
  const [isEditing, setIsEditing] = React.useState(false)
  const [error, setError] = React.useState('')

  const [handleSave] = useEditBookmarkMutation({
    onCompleted: ({ editBookmark }) => {
      setTitle(editBookmark.title)
      setIsEditing(false)
    },
    onError({ message }) {
      const clean = message.replace('GraphQL error:', '')
      console.warn(clean)
      setError(clean)
    },
  })

  const [handleDelete] = useDeleteBookmarkMutation({
    variables: { id: bookmark.id },
    update(cache) {
      const { bookmarks } = cache.readQuery({ query: GET_BOOKMARKS })
      cache.writeQuery({
        query: GET_BOOKMARKS,
        data: {
          bookmarks: bookmarks.filter((o) => o.id !== bookmark.id),
        },
      })
    },
  })

  function onChange(e) {
    error && setError('')
    setTitle(e.target.value)
  }

  function handleCancel() {
    setError('')
    setTitle(bookmark.title)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Grid gap={4}>
        <Input defaultValue={title} onChange={onChange} />
        <Small>{bookmark.host || bookmark.url}</Small>
        {error && <Small style={{ color: 'var(--accent-red)' }}>{error}</Small>}
        <div style={{ display: 'flex' }}>
          <Small
            onClick={() =>
              handleSave({ variables: { title, id: bookmark.id } })
            }
            as={'a'}
          >
            Save
          </Small>
          <Small onClick={handleCancel} style={{ marginLeft: '12px' }} as={'a'}>
            Cancel
          </Small>
          <Small
            onClick={handleDelete}
            style={{
              marginLeft: '32px',
              color: 'var(--accent-red)',
            }}
            as={'a'}
          >
            Delete
          </Small>
        </div>
      </Grid>
    )
  }

  return (
    <Grid>
      <Grid
        as={ListItem}
        href={`${bookmark.url}?ref=brianlovin.com`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Title>{bookmark.title || bookmark.url}</Title>
        <Small>{bookmark.host || bookmark.url}</Small>
      </Grid>
      {editable && (
        <Small onClick={() => setIsEditing(true)} as={'a'}>
          Edit
        </Small>
      )}
    </Grid>
  )
}

export default function BookmarksList({ bookmarks }: Props) {
  if (!bookmarks || bookmarks.length === 0) return null
  const { isMe } = useAuth()

  return (
    <Grid gap={16}>
      {bookmarks.map((bookmark) => (
        <BookmarkListItem
          editable={isMe}
          key={bookmark.url}
          bookmark={bookmark}
        />
      ))}
    </Grid>
  )
}
