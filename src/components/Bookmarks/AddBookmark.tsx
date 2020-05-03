import * as React from 'react'
import { useAddBookmarkMutation } from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'

export default function AddBookmark() {
  const [url, setUrl] = React.useState('')

  const [handleAddBookmark] = useAddBookmarkMutation({
    onCompleted: () => setUrl(''),
    optimisticResponse: {
      __typename: 'Mutation',
      addBookmark: {
        __typename: 'Bookmark',
        id: `id-${url}`,
        title: 'Saving...',
        host: url,
        url,
      },
    },
    update(cache, { data: { addBookmark } }) {
      const { bookmarks } = cache.readQuery({ query: GET_BOOKMARKS })
      cache.writeQuery({
        query: GET_BOOKMARKS,
        data: {
          bookmarks: [addBookmark, ...bookmarks],
        },
      })
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    return handleAddBookmark({ variables: { url } })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Add a url..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </form>
  )
}
