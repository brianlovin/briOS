import * as React from 'react'
import {
  Bookmark,
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input, Select, Textarea } from '~/components/Input'
import { useRouter } from 'next/router'
import Button, { DeleteButton } from '../Button'

interface Props {
  bookmark: Bookmark
  onDone: any
}

export function EditBookmark(props: Props) {
  const { bookmark, onDone } = props
  const router = useRouter()

  const initialState = {
    error: '',
    title: bookmark.title || bookmark.url,
    notes: bookmark.notes || '',
    twitterHandle: bookmark.twitterHandle || '',
    category: bookmark.category || 'reading',
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
      case 'edit-twitter-handle': {
        return {
          ...state,
          twitterHandle: action.value,
        }
      }
      case 'edit-category': {
        return {
          ...state,
          category: action.value,
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
      notes: state.notes,
      twitterHandle: state.twitterHandle,
      category: state.category,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      editBookmark: {
        __typename: 'Bookmark',
        ...bookmark,
        title: state.title,
        notes: state.notes,
        twitterHandle: state.twitterHandle,
        category: state.category,
      },
    },
    onError({ message }) {
      const value = message.replace('GraphQL error:', '')
      dispatch({ type: 'error', value })
    },
  })

  const { category } = router.query
  const [handleDelete] = useDeleteBookmarkMutation({
    variables: { id: bookmark.id },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteBookmark: true,
    },
    update(cache) {
      const { bookmarks } = cache.readQuery({
        query: GET_BOOKMARKS,
        variables: { category },
      })
      cache.writeQuery({
        query: GET_BOOKMARKS,
        variables: { category },
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

  function onTwitterHandleChange(e) {
    return dispatch({ type: 'edit-twitter-handle', value: e.target.value })
  }

  function onCategoryChange(e) {
    return dispatch({ type: 'edit-category', value: e.target.value })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return handleSave(e)
    }
  }

  return (
    <form className="mb-4 space-y-3 " onSubmit={handleSave}>
      <Input
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
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="@handle"
          value={state.twitterHandle}
          onChange={onTwitterHandleChange}
          onKeyDown={onKeyDown}
        />
        <Select
          name="category"
          id="category"
          value={state.category}
          onChange={onCategoryChange}
        >
          <option value="reading">Reading</option>
          <option value="portfolio">Portfolio</option>
          <option value="website">Personal Site / Blog</option>
        </Select>
      </div>
      {state.error && <p className="text-red-500">{state.error}</p>}

      <div className="flex justify-between">
        <DeleteButton className="text-red-500" onClick={() => handleDelete()}>
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
