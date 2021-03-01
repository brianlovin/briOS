import * as React from 'react'
import { Ama } from '~/graphql/types.generated'
import { format } from 'timeago.js'
import QuestionReaction from './QuestionReaction'
import EditQuestion from './EditQuestion'
import MarkdownRenderer from '../MarkdownRenderer'
import Linkify from '../Linkify'

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
    <div className=" space-y-1">
      <span>
        <p className="font-medium text-primary">{question.question}</p>
      </span>
      {question.answer && (
        <p className="text-tertiary clamp-3">
          <Linkify>{question.answer}</Linkify>
        </p>
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
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        )}
      </span>
    </div>
  )
})
