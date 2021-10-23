import * as React from 'react'
import { useAddBookmarkMutation } from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input } from '~/components/Input'
import Button from '../Button'
import { ErrorAlert } from '~/components/Alert'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { useRouter } from 'next/router'
import { TagPicker } from '../Tag/TagPicker'

export function AddBookmarkForm({ closeModal }) {
  const [url, setUrl] = React.useState('')
  const [tag, setTag] = React.useState('reading')
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const router = useRouter()

  const query = GET_BOOKMARKS

  const [handleAddBookmark] = useAddBookmarkMutation({
    onCompleted: ({ addBookmark: { id } }) => {
      closeModal()
      return router.push(`/bookmarks/${id}`)
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
      variables: { data: { url, tag } },
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

  const tagFilter = (t) => {
    const allowedBookmarkTags = ['website', 'reading', 'portfolio']
    return allowedBookmarkTags.indexOf(t.name) >= 0
  }

  return (
    <form className="p-4 space-y-3" onSubmit={onSubmit}>
      <Input
        type="text"
        placeholder="Add a url..."
        value={url}
        onChange={onUrlChange}
        onKeyDown={onKeyDown}
      />

      <TagPicker filter={tagFilter} defaultValue={tag} onChange={setTag} />

      <div className="flex justify-end pt-24">
        <Button disabled={!url} onClick={onSubmit}>
          {isSaving ? <LoadingSpinner /> : 'Save'}
        </Button>
      </div>
      {error && <ErrorAlert>{error}</ErrorAlert>}
    </form>
  )
}
