import * as React from 'react'
import { Ama, AmaStatus } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import Grid from '~/components/Grid'
import QuestionItem from './QuestionItem'
import AskQuestion from './AskQuestion'
import { Small } from '../Typography'
import Divider from '../Divider'

interface Props {
  questions?: Array<Ama>
}

export default function QuestionsList({ questions }: Props) {
  const { isMe } = useAuth()

  const pending = questions.filter(({ status }) => status === AmaStatus.Pending)
  const answered = questions
    .filter(({ status }) => status === AmaStatus.Answered)
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))

  return (
    <Grid gap={24}>
      <AskQuestion />

      <Divider />

      {isMe && pending.length > 0 && (
        <React.Fragment>
          {pending.map((question) => (
            <QuestionItem
              editable={isMe}
              key={question.id}
              question={question}
            />
          ))}

          <Divider />
        </React.Fragment>
      )}

      {answered.map((question) => (
        <QuestionItem editable={isMe} key={question.id} question={question} />
      ))}

      {answered.length === 0 && <Small>No questions yet!</Small>}
    </Grid>
  )
}
