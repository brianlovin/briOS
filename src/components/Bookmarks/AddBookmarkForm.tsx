import * as React from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useAddBookmarkMutation } from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input, Textarea } from '~/components/Input'
import { useRouter } from 'next/router'
import Button from '../Button'
import { ErrorAlert } from '../Alert'
import LoadingSpinner from '~/components/LoadingSpinner'

export function AddBookmarkForm({ onCloseDialog }) {
  const [url, setUrl] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  const query = GET_BOOKMARKS

  const [handleAddBookmark] = useAddBookmarkMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      addBookmark: {
        __typename: 'Bookmark',
        id: uuidv4(),
        url,
        createdAt: '',
        title: 'Saving...',
        host: null,
        image: null,
        siteName: null,
        description: null,
      },
    },
    onCompleted: ({ addBookmark: { id } }) => {
      toast.success('Saved!')
      return onCloseDialog(id)
    },
    update(cache, { data: { addBookmark } }) {
      const { bookmarks } = cache.readQuery({
        query,
      })
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
      setIsSaving(false)
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    setIsSaving(true)
    return handleAddBookmark({
      variables: { url },
    })
  }

  function onUrlChange(e) {
    error && setError('')
    return setUrl(e.target.value)
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return onSubmit(e)
    }
  }

  return (
    <form className="space-y-3 " onSubmit={onSubmit}>
      <Input
        type="text"
        placeholder="Add a url..."
        value={url}
        onChange={onUrlChange}
        onKeyDown={onKeyDown}
      />
      <div className="self-end">
        <Button disabled={!url} onClick={onSubmit}>
          {isSaving ? <LoadingSpinner /> : 'Save'}
        </Button>
      </div>
      {error && <ErrorAlert>{error}</ErrorAlert>}
    </form>
  )
}
