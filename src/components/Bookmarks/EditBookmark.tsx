import * as React from 'react'
import {
  Bookmark,
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input } from '~/components/Input'
import Button, { DeleteButton } from '../Button'

interface Props {
  bookmark: Bookmark
  onDone: (id?: string) => void
}

export function EditBookmark(props: Props) {
  const { bookmark, onDone } = props

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
    return onDone(bookmark.id)
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
    <form className="space-y-3 " onSubmit={handleSave}>
      <Input
        placeholder="Title"
        value={state.title}
        onChange={onTitleChange}
        onKeyDown={onKeyDown}
      />
      {state.error && <p className="text-red-500">{state.error}</p>}

      <div className="flex justify-between">
        <DeleteButton
          className="text-red-500"
          onClick={() => {
            handleDelete()
            onDone()
          }}
        >
          Delete
        </DeleteButton>
        <div className="flex space-x-3">
          <Button onClick={onDone}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </form>
  )
}
