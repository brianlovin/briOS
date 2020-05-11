import * as React from 'react'
import { Ama } from '~/graphql/types.generated'
import { Small, P } from '~/components/Typography'
import Grid from '~/components/Grid'
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
    <Grid gap={8}>
      <P style={{ fontWeight: '700' }}>{question.question}</P>
      {question.answer && (
        <Grid style={{ alignItems: 'start' }}>
          <Grid className={'markdown'}>
            <MarkdownRenderer>{question.answer}</MarkdownRenderer>
          </Grid>
        </Grid>
      )}

      <Grid columns={'repeat(5, max-content)'} gap={12}>
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
          <React.Fragment>
            <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>
            <Small
              style={{ cursor: 'pointer' }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Small>
          </React.Fragment>
        )}
      </Grid>
    </Grid>
  )
})
