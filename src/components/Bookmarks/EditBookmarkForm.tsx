import * as React from 'react'
import {
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input } from '~/components/Input'
import Button, { DeleteButton } from '../Button'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import { useRouter } from 'next/router'

export function EditBookmarkForm({ closeModal, bookmark }) {
  const router = useRouter()

  const initialState = {
    error: '',
    title: bookmark.title || bookmark.url,
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'edit-title': {
        return {
          ...state,
          error: '',
          title: action.value,
        }
      }
      case 'error': {
        return {
          ...state,
          error: action.value,
        }
      }
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const [editBookmark] = useEditBookmarkMutation({
    variables: {
      title: state.title,
      id: bookmark.id,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      editBookmark: {
        __typename: 'Bookmark',
        ...bookmark,
        title: state.title,
      },
    },
    onError({ message }) {
      const value = message.replace('GraphQL error:', '')
      dispatch({ type: 'error', value })
    },
  })

  const [handleDelete] = useDeleteBookmarkMutation({
    variables: { id: bookmark.id },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteBookmark: true,
    },
    update(cache) {
      const { bookmarks } = cache.readQuery({
        query: GET_BOOKMARKS,
      })

      cache.writeQuery({
        query: GET_BOOKMARK,
        variables: { id: bookmark.id },
        data: {
          bookmark: null,
        },
      })

      cache.writeQuery({
        query: GET_BOOKMARKS,
        data: {
          bookmarks: bookmarks.filter((o) => o.id !== bookmark.id),
        },
      })
    },
  })

  function handleSave(e) {
    e.preventDefault()

    if (!state.title || state.title.length === 0) {
      return dispatch({ type: 'error', value: 'Bookmark must have a title' })
    }

    editBookmark()
    return closeModal()
  }

  function onTitleChange(e) {
    return dispatch({ type: 'edit-title', value: e.target.value })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return handleSave(e)
    }
  }

  return (
    <form className="p-4 space-y-3" onSubmit={handleSave}>
      <Input
        placeholder="Title"
        value={state.title}
        onChange={onTitleChange}
        onKeyDown={onKeyDown}
      />
      {state.error && <p className="text-red-500">{state.error}</p>}

      <div className="flex justify-between">
        <DeleteButton
          onClick={() => {
            closeModal()
            handleDelete()
            router.push('/bookmarks')
          }}
        >
          Delete
        </DeleteButton>
        <div className="flex space-x-3">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </form>
  )
}
