import { useRouter } from 'next/router'
import * as React from 'react'

import { DeleteButton, PrimaryButton } from '~/components/Button'
import { Input, Textarea } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { GET_QUESTION, GET_QUESTIONS } from '~/graphql/queries/questions'
import {
  useDeleteQuestionMutation,
  useEditQuestionMutation,
} from '~/graphql/types.generated'

export function EditQuestionForm({ closeModal, question }) {
  const router = useRouter()

  const initialState = {
    error: '',
    title: question.title || question.url,
    description: question.description || '',
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

  const [editQuestion, { loading }] = useEditQuestionMutation({
    variables: {
      id: question.id,
      data: {
        title: state.title,
        description: state.description,
      },
    },
    optimisticResponse: {
      __typename: 'Mutation',
      editQuestion: {
        __typename: 'Question',
        ...question,
        title: state.title,
        description: state.description,
      },
    },
    onError({ message }) {
      const value = message.replace('GraphQL error:', '')
      dispatch({ type: 'error', value })
    },
  })

  const [handleDelete] = useDeleteQuestionMutation({
    variables: { id: question.id },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteQuestion: true,
    },
    update(cache) {
      const cacheData = cache.readQuery({
        query: GET_QUESTIONS,
        variables: { filter: { status: question.status } },
      })

      cache.writeQuery({
        query: GET_QUESTION,
        variables: { id: question.id },
        data: {
          question: null,
        },
      })

      if (cacheData) {
        // TODO: No clue how to type this...
        // @ts-ignore
        const { questions } = cacheData
        cache.writeQuery({
          query: GET_QUESTIONS,
          variables: { filter: { status: question.status } },
          data: {
            questions: {
              ...questions,
              pageInfo: {
                ...questions.pageInfo,
                totalCount: questions.pageInfo.totalCount - 1,
              },
              edges: questions.edges.filter((o) => o.node.id !== question.id),
            },
          },
        })
      }
    },
  })

  function handleSave(e) {
    e.preventDefault()

    if (!state.title || state.title.length === 0) {
      return dispatch({ type: 'error', value: 'Gotta have a question' })
    }

    editQuestion()
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

  return (
    <div className="p-4">
      <form className="space-y-3" onSubmit={handleSave}>
        <Input
          placeholder="Ask me anything..."
          value={state.title}
          onChange={onTitleChange}
          onKeyDown={onKeyDown}
        />
        {state.error && <p className="text-red-500">{state.error}</p>}

        <Textarea
          rows={4}
          defaultValue={question.description}
          onChange={onDescriptionChange}
          onKeyDown={onKeyDown}
          placeholder={'Add optional details'}
        />
      </form>
      <div className="flex justify-between pt-3">
        <DeleteButton
          onClick={() => {
            closeModal()
            handleDelete()
          }}
        >
          Delete
        </DeleteButton>
        <div className="flex space-x-3">
          <PrimaryButton
            disabled={loading || state.title.trim().length === 0}
            onClick={handleSave}
          >
            {loading ? <LoadingSpinner /> : 'Save'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
