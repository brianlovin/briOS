import * as React from 'react'
import { Ama } from '~/graphql/types.generated'
import { format } from 'timeago.js'
import QuestionReaction from './QuestionReaction'
import EditQuestion from './EditQuestion'
import { MarkdownRenderer } from '../MarkdownRenderer'
import AudioPlayer from '../AudioPlayer'
import { LinkButton } from '../Button'

interface Props {
  editable: boolean
  question: Ama
}

export const QuestionItem = React.memo((props: Props) => {
  const { question, editable } = props
  // set in state otherwise when we format() this value, it can differ between
  // the server and client
  const [updatedAt, setUpdatedAt] = React.useState(question.updatedAt)
  const [isEditing, setIsEditing] = React.useState(false)
  const [transcriptionIsVisible, setTranscriptionIsVisible] = React.useState(
    !question.audioWaveform
  )

  React.useEffect(() => {
    setUpdatedAt(question.updatedAt)
  }, [question.updatedAt])

  if (isEditing) {
    return (
      <EditQuestion onDone={() => setIsEditing(false)} question={question} />
    )
  }

  return (
    <div className="space-y-1 ">
      <span>
        <p className="text-lg font-medium text-primary">{question.question}</p>
      </span>

      {question.audioUrl && (
        <>
          <div className="py-4">
            <AudioPlayer
              src={question.audioUrl}
              id={question.id}
              waveform={question.audioWaveform}
            />
          </div>
          <div className="pb-2">
            <LinkButton
              onClick={() => setTranscriptionIsVisible(!transcriptionIsVisible)}
            >
              <div className="flex items-center space-x-2">
                {transcriptionIsVisible ? (
                  <svg
                    width="8"
                    height="6"
                    viewBox="0 0 8 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.13148 0C6.93018 0 7.40657 0.890145 6.96353 1.5547L4.83205 4.75192C4.43623 5.34566 3.56377 5.34566 3.16795 4.75192L1.03647 1.5547C0.59343 0.890145 1.06982 0 1.86852 0L6.13148 0Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    width="6"
                    height="8"
                    viewBox="0 0 6 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 1.86852C0 1.06982 0.890145 0.59343 1.5547 1.03647L4.75192 3.16795C5.34566 3.56377 5.34566 4.43623 4.75192 4.83205L1.5547 6.96353C0.890145 7.40657 0 6.93018 0 6.13148V1.86852Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <span>
                  {transcriptionIsVisible ? 'Hide' : 'Show'} transcript (beta)
                </span>
              </div>
            </LinkButton>
          </div>
        </>
      )}

      {question.answer && transcriptionIsVisible && (
        <div className="prose text-tertiary">
          <MarkdownRenderer>{question.answer}</MarkdownRenderer>
        </div>
      )}
      <span className="flex items-center space-x-2 text-tertiary">
        <QuestionReaction question={question} />
        <span className="text-quaternary">{' · '}</span>

        <p
          className={`${question.answer ? 'text-tertiary' : 'text-yellow-500'}`}
        >
          {format(updatedAt)}
        </p>

        {editable && (
          <div className="flex space-x-2">
            <span className="text-quaternary">·</span>
            <button
              className="text-tertiary hover:text-gray-1000 dark:hover:text-gray-50"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
      </span>
    </div>
  )
})
