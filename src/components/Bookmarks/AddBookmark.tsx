import * as React from 'react'
import { useAddBookmarkMutation } from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Small } from '~/components/Typography'
import { Input } from '~/components/Overthought/Feedback/style'

export default function AddBookmark() {
  const [url, setUrl] = React.useState('')
  const [error, setError] = React.useState('')
  const query = GET_BOOKMARKS

  const [handleAddBookmark] = useAddBookmarkMutation({
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
      console.warn(clean)
      setError(clean)
      setUrl('')
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    return handleAddBookmark({ variables: { url } })
  }

  function onChange(e) {
    error && setError('')
    return setUrl(e.target.value)
  }

  return (
    <form style={{ width: '100%', marginTop: '24px' }} onSubmit={onSubmit}>
      <Input
        autoFocus
        type="text"
        placeholder="Add a url..."
        value={url}
        onChange={onChange}
        style={{ width: '100%' }}
      />
      {error && (
        <Small style={{ color: 'var(--accent-red)', marginTop: '4px' }}>
          {error}
        </Small>
      )}
    </form>
  )
}
