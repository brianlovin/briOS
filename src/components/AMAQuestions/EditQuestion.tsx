import * as React from 'react'
import {
  Ama,
  useEditAmaQuestionMutation,
  AmaStatus,
  useDeleteAmaQuestionMutation,
} from '~/graphql/types.generated'
import { Small } from '~/components/Typography'
import { GET_AMA_QUESTIONS } from '~/graphql/queries'
import Textarea from '~/components/Textarea'
import Grid from '~/components/Grid'

interface Props {
  question: Ama
  onDone: Function
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
      const { amaQuestions } = cache.readQuery({ query: GET_AMA_QUESTIONS })
      cache.writeQuery({
        query: GET_AMA_QUESTIONS,
        data: {
          amaQuestions: amaQuestions.filter((o) => o.id !== question.id),
        },
      })
    },
    onCompleted() {
      return onDone()
    },
  })

  function onQuestionChange(e) {
    dispatch({ type: 'edit-question', value: e.target.value })
  }

  function onAnswerChange(e) {
    dispatch({ type: 'edit-answer', value: e.target.value })
  }

  function handleSave(e) {
    e.preventDefault()

    editQuestion()
    return onDone()
  }

  return (
    <Grid gap={12} as={'form'} onSubmit={handleSave}>
      <Textarea
        placeholder="Question"
        value={state.question}
        onChange={onQuestionChange}
      />

      <Textarea
        autoFocus
        placeholder="Answer..."
        value={state.answer}
        onChange={onAnswerChange}
        rows={5}
      />

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
