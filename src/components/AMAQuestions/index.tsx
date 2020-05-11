import * as React from 'react'
import { useGetAmaQuestionsQuery, AmaStatus } from '~/graphql/types.generated'
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
import FullscreenLoading from '../FullscreenLoading'
import GlobalMarkdownStyles from '../GlobalStyles/markdown'

export default function QuestionsList() {
  const { isMe } = useAuth()
  const [showLoadMore, setShowLoadMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  // pre-populate data from the cache, but check for any new ones after
  // the page loads
  const { data, fetchMore, error } = useGetAmaQuestionsQuery({
    variables: { status: AmaStatus.Answered },
    fetchPolicy: 'cache-and-network',
  })

  // this can happen if the route is navigated to from the client or if the
  // cache fails to populate for whatever reason
  if (!data || !data.amaQuestions) return <FullscreenLoading />
  if (error) return null

  const { amaQuestions: questions } = data

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
      <GlobalMarkdownStyles />

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
