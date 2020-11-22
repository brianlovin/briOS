import * as React from 'react'
import { Ama } from '~/graphql/types.generated'
import { format } from 'timeago.js'
import QuestionReaction from './QuestionReaction'
import EditQuestion from './EditQuestion'
import MarkdownRenderer from '../MarkdownRenderer'

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

  React.useEffect(() => {
    setUpdatedAt(question.updatedAt)
  }, [question.updatedAt])

  if (isEditing) {
    return (
      <EditQuestion onDone={() => setIsEditing(false)} question={question} />
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      <p className="font-bold">{question.question}</p>
      {question.answer && (
        <div className="prose lg:prose-lg flex flex-col">
          <MarkdownRenderer>{question.answer}</MarkdownRenderer>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <QuestionReaction question={question} />

        <span className="divider-gray">/</span>

        <p
          className={`p-small ${
            question.answer ? 'text-gray-700' : 'text-yellow-500'
          }`}
        >
          {question.answer ? 'Updated' : 'Asked'} {format(updatedAt)}
        </p>

        {editable && (
          <div className="flex space-x-2">
            <span className="divider-gray">/</span>
            <button
              className="p-small black-link"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
