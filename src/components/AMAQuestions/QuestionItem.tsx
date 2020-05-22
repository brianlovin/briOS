import * as React from 'react'
import { Ama } from '~/graphql/types.generated'
import { Small, P } from '~/components/Typography'
import { format } from 'timeago.js'
import QuestionReaction from './QuestionReaction'
import EditQuestion from './EditQuestion'
import MarkdownRenderer from '../MarkdownRenderer'
import Flex from '../Flex'

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
    <Flex flexDirection="column" gap={question.answer ? 8 : 4}>
      <P style={{ fontWeight: '700' }}>{question.question}</P>
      {question.answer && (
        <Flex className={'markdown'}>
          <MarkdownRenderer>{question.answer}</MarkdownRenderer>
        </Flex>
      )}

      <Flex gap={12} alignItems="center">
        <QuestionReaction question={question} />

        <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>

        <Small
          style={{
            color: `var(--${
              question.answer ? 'text-quaternary' : 'accent-orange'
            })`,
          }}
        >
          {question.answer ? 'Updated' : 'Asked'} {format(updatedAt)}
        </Small>

        {editable && (
          <Flex gap={8}>
            <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>
            <Small
              style={{ cursor: 'pointer' }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Small>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
})
