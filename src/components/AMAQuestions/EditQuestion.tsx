import * as React from 'react'
import {
  Ama,
  useEditAmaQuestionMutation,
  AmaStatus,
  useDeleteAmaQuestionMutation,
} from '~/graphql/types.generated'
import { GET_AMA_QUESTIONS } from '~/graphql/queries'
import Textarea from '~/components/Textarea'

interface Props {
  question: Ama
  onDone: any
}

interface State {
  question: string
  answer: string
  error: string
}

type Action =
  | { type: 'edit-question'; value: string }
  | { type: 'edit-answer'; value: string }
  | { type: 'error'; value: string }

export default function EditQuestion(props: Props) {
  const { question, onDone } = props

  const initialState = {
    question: question.question,
    answer: question.answer || '',
    error: '',
  }

  function reducer(state: State, action: Action) {
    switch (action.type) {
      case 'edit-question': {
        return {
          ...state,
          error: '',
          question: action.value,
        }
      }
      case 'edit-answer': {
        return {
          ...state,
          answer: action.value,
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

  const [editQuestion] = useEditAmaQuestionMutation({
    variables: {
      question: state.question,
      id: question.id,
      answer: state.answer,
      status: state.answer.length > 0 ? AmaStatus.Answered : AmaStatus.Pending,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      editAMAQuestion: {
        __typename: 'AMA',
        ...question,
        question: state.question,
        answer: state.answer,
        status:
          state.answer.length > 0 ? AmaStatus.Answered : AmaStatus.Pending,
        updatedAt: `${new Date().getTime()}`,
      },
    },
    refetchQueries: [
      {
        query: GET_AMA_QUESTIONS,
        variables: {
          status: AmaStatus.Answered,
        },
      },
    ],
    update(cache) {
      const { amaQuestions } = cache.readQuery({
        query: GET_AMA_QUESTIONS,
        variables: {
          status: AmaStatus.Pending,
        },
      })
      cache.writeQuery({
        query: GET_AMA_QUESTIONS,
        variables: {
          status: AmaStatus.Pending,
        },
        data: {
          amaQuestions: amaQuestions.filter((o) => o.id !== question.id),
        },
      })
    },
    onError({ message }) {
      const value = message.replace('GraphQL error:', '')
      dispatch({ type: 'error', value })
    },
  })

  const [handleDelete] = useDeleteAmaQuestionMutation({
    variables: { id: question.id },
    optimisticResponse: {
      __typename: 'Mutation',
    },
    update(cache) {
      const { amaQuestions } = cache.readQuery({
        query: GET_AMA_QUESTIONS,
        variables: {
          status: AmaStatus.Pending,
        },
      })
      cache.writeQuery({
        query: GET_AMA_QUESTIONS,
        variables: {
          status: AmaStatus.Pending,
        },
        data: {
          amaQuestions: amaQuestions.filter((o) => o.id !== question.id),
        },
      })
    },
    onCompleted() {
      return onDone()
    },
  })

  function handleSave(e) {
    e.preventDefault()

    editQuestion()
    return onDone()
  }

  function onQuestionChange(e) {
    return dispatch({ type: 'edit-question', value: e.target.value })
  }

  function onAnswerChange(e) {
    return dispatch({ type: 'edit-answer', value: e.target.value })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return editQuestion()
    }
  }

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSave}>
      <Textarea
        placeholder="Question"
        value={state.question}
        onChange={onQuestionChange}
        onKeyDown={onKeyDown}
      />

      <Textarea
        autoFocus
        placeholder="Answer..."
        value={state.answer}
        onChange={onAnswerChange}
        onKeyDown={onKeyDown}
        rows={5}
      />

      {state.error && <p className="text-red-500">{state.error}</p>}

      <div className="flex space-between justify-between">
        <div className="flex space-x-3">
          <button className="text-blue-500" onClick={handleSave}>
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
