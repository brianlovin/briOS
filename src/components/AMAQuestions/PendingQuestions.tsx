import * as React from 'react'
import Divider from '../Divider'
import { QuestionItem } from './QuestionItem'
import { useGetAmaQuestionsQuery, AmaStatus } from '~/graphql/types.generated'
import LoadingSpinner from '../LoadingSpinner'

export default function PendingQuestion() {
  const { data, loading } = useGetAmaQuestionsQuery({
    variables: {
      status: AmaStatus.Pending,
    },
  })

  if (loading) {
    return <LoadingSpinner />
  }

  if (!data || !data.amaQuestions) return null

  return (
    <React.Fragment>
      {data.amaQuestions.map((question) => (
        <QuestionItem editable={true} key={question.id} question={question} />
      ))}

      <Divider />
    </React.Fragment>
  )
}
