import * as React from 'react'
import { useGetAmaQuestionsQuery, AmaStatus } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import Divider from '~/components/Divider'
import LoadingSpinner from '~/components/LoadingSpinner'
import { PAGINATION_AMOUNT } from '~/graphql/constants'
import { QuestionItem } from './QuestionItem'
import AskQuestion from './AskQuestion'
import PendingQuestions from './PendingQuestions'
import FullscreenLoading from '../FullscreenLoading'

export default function QuestionsList() {
  const { isMe } = useAuth()
  const [showLoadMore, setShowLoadMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  // pre-populate data from the cache, but check for any new ones after
  // the page loads
  const { data, fetchMore, error } = useGetAmaQuestionsQuery({
    variables: { status: AmaStatus.Answered },
  })

  // this can happen if the route is navigated to from the client or if the
  // cache fails to populate for whatever reason
  if (!data || !data.amaQuestions) return <FullscreenLoading />
  if (error) return null

  const { amaQuestions: questions } = data

  function handleLoadMore() {
    if (loading) return

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
    <div className="flex flex-col mt-8 space-y-8">
      <AskQuestion />

      {isMe && <PendingQuestions />}

      {questions.map((question) => (
        <QuestionItem editable={isMe} key={question.id} question={question} />
      ))}

      {questions.length === 0 && <p>No questions yet!</p>}

      {showLoadMore && (
        <button className="btn" onClick={handleLoadMore}>
          {loading ? <LoadingSpinner /> : 'Show me more'}
        </button>
      )}
    </div>
  )
}
