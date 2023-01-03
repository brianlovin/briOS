import { useRouter } from 'next/router'
import * as React from 'react'
import toast from 'react-hot-toast'

import Button from '~/components/Button'
import { Input } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { TagPicker } from '~/components/Tag/TagPicker'
import { GET_BOOKMARKS } from '~/graphql/queries/bookmarks'
import {
  GetBookmarksQuery,
  useAddBookmarkMutation,
  useGetBookmarksQuery,
} from '~/graphql/types.generated'

export function AddBookmarkForm({ closeModal }) {
  const [url, setUrl] = React.useState('')
  const [tag, setTag] = React.useState('reading')
  const router = useRouter()

  const query = GET_BOOKMARKS

  const [addBookmark, { loading }] = useAddBookmarkMutation()

  // fetch all bookmarks in the background so that we can update the cache
  // immediately when the bookmark is saved
  const _ = useGetBookmarksQuery()

  function onSubmit(e) {
    e.preventDefault()

    addBookmark({
      variables: { data: { url, tag } },
      update(cache, { data: { addBookmark } }) {
        const { bookmarks } = cache.readQuery<GetBookmarksQuery>({ query })
        return cache.writeQuery({
          query,
          data: {
            bookmarks: {
              ...bookmarks,
              edges: [
                {
                  __typename: 'BookmarkEdge',
                  cursor: addBookmark.id,
                  node: addBookmark,
                },
                ...bookmarks.edges,
              ],
            },
          },
        })
      },
      onError() {},
    }).then(
      ({
        data: {
          addBookmark: { id },
        },
      }) => {
        closeModal()
        // if I'm already viewing bookmarks, push me to the one I just created.
        // otherwise, this was triggered from the sidebar shortcut and
        // don't redirect
        if (router.asPath.indexOf('/bookmarks') >= 0) {
          return router.push(`/bookmarks/${id}`)
        } else {
          toast.success('Bookmark created')
        }
      }
    )
  }

  function onUrlChange(e) {
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
        <Button disabled={!url || loading} onClick={onSubmit}>
          {loading ? <LoadingSpinner /> : 'Save'}
        </Button>
      </div>
    </form>
  )
}
