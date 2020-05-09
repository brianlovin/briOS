import * as React from 'react'
import { useAddBookmarkMutation } from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Small } from '~/components/Typography'
import Input from '~/components/Input'
import Grid from '../Grid'
import Textarea from '../Textarea'

export default function AddBookmark() {
  const [url, setUrl] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [error, setError] = React.useState('')
  const query = GET_BOOKMARKS

  const [handleAddBookmark] = useAddBookmarkMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      addBookmark: {
        __typename: 'Bookmark',
        id: url,
        title: 'Saving...',
        url,
        notes,
        host: url,
        reactions: 0,
      },
    },
    onCompleted: () => setUrl(''),
    update(cache, { data: { addBookmark } }) {
      const { bookmarks } = cache.readQuery({ query })
      cache.writeQuery({
        query,
        data: {
          bookmarks: [addBookmark, ...bookmarks],
        },
      })
    },
    onError({ message }) {
      const clean = message.replace('GraphQL error:', '')
      setError(clean)
      setUrl('')
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    return handleAddBookmark({ variables: { url, notes } })
  }

  function onUrlChange(e) {
    error && setError('')
    return setUrl(e.target.value)
  }

  function onNotesChange(e) {
    return setNotes(e.target.value)
  }

  return (
    <Grid gap={12} as={'form'} onSubmit={onSubmit}>
      <Input
        autoFocus
        type="text"
        placeholder="Add a url..."
        value={url}
        onChange={onUrlChange}
        style={{ width: '100%' }}
      />
      {url.length > 0 && (
        <React.Fragment>
          <Textarea placeholder="Notes..." onChange={onNotesChange} />
          <Small style={{ cursor: 'pointer' }} onClick={onSubmit}>
            Save
          </Small>
        </React.Fragment>
      )}
      {error && <Small style={{ color: 'var(--accent-red)' }}>{error}</Small>}
    </Grid>
  )
}
