import * as React from 'react'
import { useAddBookmarkMutation } from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input, Textarea } from '~/components/Input'
import { useRouter } from 'next/router'

export default function AddBookmark() {
  const router = useRouter()
  const [url, setUrl] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [twitterHandle, setTwitterHandle] = React.useState('')
  const [category, setCategory] = React.useState(
    typeof router.query.category === 'string'
      ? router.query.category
      : 'reading'
  )
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
        id: url,
        title: 'Saving...',
        url,
        notes,
        twitterHandle,
        category,
        host: url,
        reactions: 0,
      },
    },
    onCompleted: () => {
      setUrl('')
      setNotes('')
      setTwitterHandle('')
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
    },
  })

  function onSubmit(e) {
    e.preventDefault()
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
    <form className="flex flex-col space-y-3" onSubmit={onSubmit}>
      <Input
        autoFocus
        type="text"
        placeholder="Add a url..."
        value={url}
        onChange={onUrlChange}
        onKeyDown={onKeyDown}
      />
      {url.length > 0 && (
        <React.Fragment>
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
          <button className="self-end btn btn-primary" onClick={onSubmit}>
            Save
          </button>
        </React.Fragment>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
