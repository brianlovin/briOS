import * as React from 'react'
import {
  Bookmark,
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { Small } from '~/components/Typography'
import { GET_BOOKMARKS } from '~/graphql/queries'
import Input from '~/components/Input'
import Textarea from '~/components/Textarea'
import Flex from '../Flex'

interface Props {
  bookmark: Bookmark
  onDone: Function
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
    <Flex flexDirection="column" gap={12} as={'form'} onSubmit={handleSave}>
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
      {state.error && (
        <Small style={{ color: 'var(--accent-red)' }}>{state.error}</Small>
      )}

      <Flex justifyContent="space-between">
        <Flex gap={12}>
          <Small style={{ cursor: 'pointer' }} onClick={handleSave}>
            Save
          </Small>
          <Small style={{ cursor: 'pointer' }} onClick={onDone}>
            Cancel
          </Small>
        </Flex>
        <Small
          onClick={handleDelete}
          style={{
            cursor: 'pointer',
            color: 'var(--accent-red)',
          }}
        >
          Delete
        </Small>
      </Flex>
    </Flex>
  )
}
