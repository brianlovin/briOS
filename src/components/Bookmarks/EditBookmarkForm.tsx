import * as React from 'react'
import {
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { Input, Textarea } from '~/components/Input'
import Button, { DeleteButton } from '../Button'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import { useRouter } from 'next/router'
import { TagPicker } from '../Tag/TagPicker'

export function EditBookmarkForm({ closeModal, bookmark }) {
  const router = useRouter()

  const initialState = {
    error: '',
    title: bookmark.title || bookmark.url,
    description: bookmark.description || '',
    tag: bookmark.tags[0].name,
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
      case 'edit-description': {
        return {
          ...state,
          error: '',
          description: action.value,
        }
      }
      case 'edit-tag': {
        return {
          ...state,
          error: '',
          tag: action.value,
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
      id: bookmark.id,
      data: {
        title: state.title,
        description: state.description,
        tag: state.tag,
      },
    },
    optimisticResponse: {
      __typename: 'Mutation',
      editBookmark: {
        __typename: 'Bookmark',
        ...bookmark,
        title: state.title,
        description: state.description,
        tags: [{ name: state.tag }],
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

  function onDescriptionChange(e) {
    return dispatch({ type: 'edit-description', value: e.target.value })
  }

  function onTagChange(val) {
    dispatch({ type: 'edit-tag', value: val })
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

      <TagPicker defaultValue={bookmark.tags[0].name} onChange={onTagChange} />

      <Textarea
        rows={4}
        defaultValue={bookmark.description}
        onChange={onDescriptionChange}
        onKeyDown={onKeyDown}
      />

      <div className="flex justify-between pt-24">
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
