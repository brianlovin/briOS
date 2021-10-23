import * as React from 'react'
import {
  useDeleteStackMutation,
  useEditStackMutation,
} from '~/graphql/types.generated'
import { Input, Textarea } from '~/components/Input'
import Button, { DeleteButton } from '../Button'
import { useRouter } from 'next/router'
import { GET_STACK, GET_STACKS } from '~/graphql/queries/stack'
import { StackImageUploader } from './StackImageUploader'
import { TagPicker } from '../Tag/TagPicker'

export function EditStackForm({ closeModal, stack }) {
  const router = useRouter()

  const initialState = {
    error: '',
    name: stack.name,
    description: stack.description,
    url: stack.url,
    image: stack.image,
    tag: stack.tags?.length > 0 ? stack.tags[0].name : null,
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'edit-name': {
        return {
          ...state,
          error: '',
          name: action.value,
        }
      }
      case 'edit-description': {
        return {
          ...state,
          error: '',
          description: action.value,
        }
      }
      case 'edit-url': {
        return {
          ...state,
          error: '',
          url: action.value,
        }
      }
      case 'edit-image': {
        return {
          ...state,
          error: '',
          image: action.value,
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

  const [editStack] = useEditStackMutation()

  const [handleDelete] = useDeleteStackMutation({
    variables: { id: stack.id },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteStack: true,
    },
    update(cache) {
      const { stacks } = cache.readQuery({
        query: GET_STACKS,
      })

      cache.writeQuery({
        query: GET_STACK,
        variables: { id: stack.id },
        data: {
          stack: null,
        },
      })

      cache.writeQuery({
        query: GET_STACKS,
        data: {
          stacks: stacks.filter((o) => o.id !== stack.id),
        },
      })
    },
  })

  function handleSave(e) {
    e.preventDefault()

    if (!state.name || state.name.length === 0) {
      return dispatch({ type: 'error', value: 'Stack must have a name' })
    }

    if (!state.url || state.url.length === 0) {
      return dispatch({ type: 'error', value: 'Stack must have a URL' })
    }

    editStack({
      variables: {
        id: stack.id,
        data: {
          name: state.name,
          description: state.description,
          url: state.url,
          image: state.image,
          tag: state.tag,
        },
      },
      optimisticResponse: {
        __typename: 'Mutation',
        editStack: {
          __typename: 'Stack',
          ...stack,
          name: state.name,
          description: state.description,
          url: state.url,
          image: state.image,
          tags: state.tag ? [{ name: state.tag }] : [],
        },
      },
      onError({ message }) {
        const value = message.replace('GraphQL error:', '')
        dispatch({ type: 'error', value })
      },
    })
    return closeModal()
  }

  function onNameChange(e) {
    return dispatch({ type: 'edit-name', value: e.target.value })
  }

  function onURLChange(e) {
    return dispatch({ type: 'edit-url', value: e.target.value })
  }

  function onDescriptionChange(e) {
    return dispatch({ type: 'edit-description', value: e.target.value })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return handleSave(e)
    }
  }

  function onImageUploaded(url) {
    dispatch({
      type: 'edit-image',
      value: url,
    })
  }

  function handleTagChange(value) {
    return dispatch({ type: 'edit-tag', value })
  }

  return (
    <div className="p-4 space-y-3">
      <StackImageUploader stack={stack} onImageUploaded={onImageUploaded} />

      <form className="space-y-3" onSubmit={handleSave}>
        <Input
          placeholder="URL"
          value={state.url}
          onChange={onURLChange}
          onKeyDown={onKeyDown}
        />

        <Input
          placeholder="Title"
          value={state.name}
          onChange={onNameChange}
          onKeyDown={onKeyDown}
        />

        <TagPicker defaultValue={state.tag} onChange={handleTagChange} />

        <Textarea
          rows={4}
          placeholder="Description"
          value={state.description}
          onChange={onDescriptionChange}
          onKeyDown={onKeyDown}
        />

        {state.error && <p className="text-red-500">{state.error}</p>}

        <div className="flex justify-between">
          <DeleteButton
            onClick={() => {
              closeModal()
              handleDelete()
              router.push('/stack')
            }}
          >
            Delete
          </DeleteButton>
          <div className="flex space-x-3">
            <Button disabled={!state.image} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
