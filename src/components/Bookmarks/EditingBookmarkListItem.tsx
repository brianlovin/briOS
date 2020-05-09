import * as React from 'react'
import {
  Bookmark,
  useDeleteBookmarkMutation,
  useEditBookmarkMutation,
} from '~/graphql/types.generated'
import { Small } from '~/components/Typography'
import { GET_BOOKMARKS } from '~/graphql/queries'
import Input from '~/components/Input'
import Grid from '~/components/Grid'

interface Props {
  bookmark: Bookmark
  onDone: Function
}

export default function EditingBookmarkListItem(props: Props) {
  const { bookmark, onDone } = props

  const initialState = {
    error: '',
    title: bookmark.title,
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'edit': {
        return {
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

  const [saveBookmark] = useEditBookmarkMutation({
    variables: { title: state.title, id: bookmark.id },
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

  function onChange(e) {
    dispatch({ type: 'edit', value: e.target.value })
  }

  function handleSave(e) {
    e.preventDefault()

    if (!state.title || state.title.length === 0) {
      return dispatch({ type: 'error', value: 'Bookmark must have a title' })
    }

    saveBookmark()
    return onDone()
  }

  return (
    <Grid gap={12} as={'form'} onSubmit={handleSave}>
      <Input value={state.title} onChange={onChange} />

      {state.error && (
        <Small style={{ color: 'var(--accent-red)' }}>{state.error}</Small>
      )}

      <Grid gap={12} columns={'min-content 1fr min-content'}>
        <Small style={{ cursor: 'pointer' }} onClick={handleSave}>
          Save
        </Small>
        <Small style={{ cursor: 'pointer' }} onClick={onDone}>
          Cancel
        </Small>
        <Small
          onClick={handleDelete}
          style={{
            cursor: 'pointer',
            color: 'var(--accent-red)',
          }}
        >
          Delete
        </Small>
      </Grid>
    </Grid>
  )
}
