import * as React from 'react'
import { Ama } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import Grid from '~/components/Grid'
import { Small } from '~/components/Typography'
import Divider from '~/components/Divider'
import { Button } from '~/components/Button'
import LoadingSpinner from '~/components/LoadingSpinner'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import { QuestionItem } from './QuestionItem'
import AskQuestion from './AskQuestion'
import PendingQuestions from './PendingQuestions'

interface Props {
  questions?: Array<Ama>
  fetchMore?: Function
}

export default function QuestionsList({ questions, fetchMore }: Props) {
  const { isMe } = useAuth()
  const [showLoadMore, setShowLoadMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  function handleLoadMore() {
    setLoading(true)

    try {
      fetchMore({
        variables: {
          skip: questions.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          setLoading(false)

          if (!fetchMoreResult) return prev

          if (fetchMoreResult.amaQuestions.length < PAGINATION_AMOUNT) {
            // at the end of the list
            setShowLoadMore(false)
          }

          return Object.assign({}, prev, {
            amaQuestions: [
              ...prev.amaQuestions,
              ...fetchMoreResult.amaQuestions,
            ],
          })
        },
      })
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <Grid gap={32}>
      <AskQuestion />

      <Divider />

      {isMe && <PendingQuestions />}

      {questions.map((question) => (
        <QuestionItem editable={isMe} key={question.id} question={question} />
      ))}

      {questions.length === 0 && <Small>No questions yet!</Small>}

      {showLoadMore && (
        <Button style={{ width: '100%' }} onClick={handleLoadMore}>
          {loading ? <LoadingSpinner size={16} /> : 'Show me more'}
        </Button>
      )}
    </Grid>
  )
}
