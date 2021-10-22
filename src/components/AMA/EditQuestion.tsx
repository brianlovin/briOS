import * as React from 'react'
import {
  Ama,
  useEditAmaQuestionMutation,
  AmaStatus,
  useDeleteAmaQuestionMutation,
} from '~/graphql/types.generated'
import { GET_AMA_QUESTIONS, GET_SIGNED_UPLOAD_URL } from '~/graphql/queries'
import { Textarea } from '~/components/Input'
import Button, { DeleteButton } from '../Button'
import AudioRecorder from '../AudioRecorder'
import toast from 'react-hot-toast'

interface Props {
  question: Ama
  onDone: any
}

interface State {
  question: string
  answer: string
  error: string
  waveform: number[]
  src: string
  isRecording: boolean
}

type Action =
  | { type: 'edit-question'; value: string }
  | { type: 'edit-answer'; value: string }
  | { type: 'error'; value: string }
  | { type: 'is-recording'; value: boolean }
  | { type: 'remove-audio' }
  | { type: 'add-waveform'; value: { waveform: number[]; src: string } }

export default function EditQuestion(props: Props) {
  const { question, onDone } = props

  const initialState = {
    question: question.question,
    answer: question.answer || '',
    waveform: question.audioWaveform,
    src: question.audioUrl,
    error: '',
    isRecording: false,
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
      case 'add-waveform': {
        return {
          ...state,
          waveform: action.value.waveform,
          src: action.value.src,
        }
      }
      case 'is-recording': {
        return {
          ...state,
          isRecording: action.value,
        }
      }
      case 'remove-audio': {
        return {
          ...state,
          waveform: [],
          src: null,
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
      status:
        state.answer.length > 0 || state.waveform?.length > 0
          ? AmaStatus.Answered
          : AmaStatus.Pending,
      audioWaveform: state.waveform,
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
        audioWaveform: state.waveform,
        audioUrl: state.src,
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

  async function onTranscriptionComplete({ transcript, waveform, src }) {
    dispatch({ type: 'edit-answer', value: transcript })
    dispatch({ type: 'add-waveform', value: { waveform, src } })
    dispatch({ type: 'is-recording', value: false })
  }

  function onRecordingStart() {
    dispatch({ type: 'is-recording', value: true })
  }

  function onDeleteAudio() {
    dispatch({ type: 'remove-audio' })
  }

  return (
    <>
      <div className="p-4 space-y-6 bg-white border border-gray-200 rounded-md shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-semibold text-primary">Question</p>
          <Textarea
            placeholder="Question"
            value={state.question}
            onChange={onQuestionChange}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="flex flex-col space-y-2 ">
          <p className="text-sm font-semibold text-primary">Record answer</p>
          <AudioRecorder
            id={question.id}
            initialAudioUrl={state.src}
            initialWaveform={state.waveform}
            onTranscriptionComplete={onTranscriptionComplete}
            onRecordingStart={onRecordingStart}
            onDeleteAudio={onDeleteAudio}
          />
        </div>

        {!state.isRecording && (
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold text-primary">
              {state.waveform ? 'Transcript' : 'Answer'}
            </p>
            <Textarea
              placeholder="Answer..."
              value={state.answer}
              onChange={onAnswerChange}
              onKeyDown={onKeyDown}
              rows={5}
            />
          </div>
        )}

        {state.error && <p className="text-red-500">{state.error}</p>}

        {state.isRecording && (
          <div className="flex justify-between space-between">
            <Button onClick={onDone}>Cancel</Button>
          </div>
        )}

        {!state.isRecording && (
          <div className="flex justify-between space-between">
            <DeleteButton onClick={() => handleDelete()}>
              Delete question
            </DeleteButton>
            <div className="flex space-x-3">
              <Button onClick={onDone}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
