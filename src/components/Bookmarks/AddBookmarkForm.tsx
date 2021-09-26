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
  const router = useRouter()
  const [url, setUrl] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [twitterHandle, setTwitterHandle] = React.useState('')
  const [category, setCategory] = React.useState(
    typeof router.query.category === 'string'
      ? router.query.category
      : 'reading'
  )
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const query = GET_BOOKMARKS

  React.useEffect(() => {
    if (typeof router.query.category === 'string') {
      setCategory(router.query.category)
    }
  }, [router.query.category])

  const [handleAddBookmark] = useAddBookmarkMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      addBookmark: {
        __typename: 'Bookmark',
        id: uuidv4(),
        title: 'Saving...',
        url,
        notes,
        twitterHandle,
        category,
        host: url,
        reactions: 0,
      },
    },
    onCompleted: ({ addBookmark: { id } }) => {
      toast.success('Saved!')
      return onCloseDialog(id)
    },
    update(cache, { data: { addBookmark } }) {
      const { bookmarks } = cache.readQuery({
        query,
        variables: { category: router.query.category },
      })
      cache.writeQuery({
        query,
        variables: { category: router.query.category },
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
      variables: { url, notes, category, twitterHandle },
    })
  }

  function onUrlChange(e) {
    error && setError('')
    return setUrl(e.target.value)
  }

  function onNotesChange(e) {
    return setNotes(e.target.value)
  }

  function onCategoryChange(e) {
    return setCategory(e.target.value)
  }

  function onTwitterHandleChange(e) {
    return setTwitterHandle(e.target.value)
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
      <Textarea
        placeholder="Notes..."
        onChange={onNotesChange}
        onKeyDown={onKeyDown}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="text"
          placeholder="@handle"
          value={twitterHandle}
          onChange={onTwitterHandleChange}
          onKeyDown={onKeyDown}
        />

        <select
          name="category"
          id="category"
          value={category}
          onChange={onCategoryChange}
        >
          <option value="reading">Reading</option>
          <option value="portfolio">Portfolio</option>
          <option value="website">Personal Site / Blog</option>
        </select>
      </div>
      <div className="self-end">
        <Button disabled={!url} onClick={onSubmit}>
          {isSaving ? <LoadingSpinner /> : 'Save'}
        </Button>
      </div>
      {error && <ErrorAlert>{error}</ErrorAlert>}
    </form>
  )
}
