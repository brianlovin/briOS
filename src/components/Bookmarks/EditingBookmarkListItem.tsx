import * as React from 'react'
import {
  Bookmark,
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input, Textarea } from '~/components/Input'

interface Props {
  bookmark: Bookmark
  onDone: any
}

export default function EditingBookmarkListItem(props: Props) {
  const { bookmark, onDone } = props

  const initialState = {
    error: '',
    title: bookmark.title || bookmark.url,
    notes: bookmark.notes || '',
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
      case 'edit-notes': {
        return {
          ...state,
          notes: action.value,
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
    variables: { title: state.title, id: bookmark.id, notes: state.notes },
    optimisticResponse: {
      __typename: 'Mutation',
      editBookmark: {
        __typename: 'Bookmark',
        ...bookmark,
        title: state.title,
        notes: state.notes,
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
    },
    update(cache) {
      const { bookmarks } = cache.readQuery({ query: GET_BOOKMARKS })
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
    return onDone()
  }

  function onTitleChange(e) {
    return dispatch({ type: 'edit-title', value: e.target.value })
  }

  function onNotesChange(e) {
    return dispatch({ type: 'edit-notes', value: e.target.value })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return handleSave(e)
    }
  }

  return (
    <form className="flex flex-col space-y-3" onSubmit={handleSave}>
      <Input
        autoFocus
        placeholder="Title"
        value={state.title}
        onChange={onTitleChange}
        onKeyDown={onKeyDown}
      />
      <Textarea
        placeholder="Notes..."
        value={state.notes}
        rows={7}
        onChange={onNotesChange}
        onKeyDown={onKeyDown}
      />
      {state.error && <p className="text-red-500">{state.error}</p>}

      <div className="flex justify-between">
        <div className="flex space-x-3">
          <button className="black-link" onClick={handleSave}>
            Save
          </button>
          <button className="black-link" onClick={onDone}>
            Cancel
          </button>
        </div>
        <button className="text-red-500" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </form>
  )
}
