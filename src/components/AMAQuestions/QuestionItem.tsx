import * as React from 'react'
import { Ama, AmaStatus } from '~/graphql/types.generated'
import { Small, P } from '~/components/Typography'
import Grid from '~/components/Grid'
import { format } from 'timeago.js'
import QuestionReaction from './QuestionReaction'
import EditQuestion from './EditQuestion'

interface Props {
  editable: boolean
  question: Ama
}

export default function QuestionItem(props: Props) {
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
    <Grid gap={question.answer ? 8 : 4}>
      <P style={{ fontWeight: '500' }}>{question.question}</P>
      {question.answer && (
        <Grid style={{ alignItems: 'start' }} columns={'1fr'}>
          <P>{question.answer}</P>
        </Grid>
      )}

      <Grid columns={'repeat(5, max-content)'} gap={12}>
        <QuestionReaction question={question} />

        <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>

        <Small>
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
}
