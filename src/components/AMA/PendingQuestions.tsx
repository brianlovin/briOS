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
    return (
      <div className="flex items-center justify-center w-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!data || !data.amaQuestions) return null

  return (
    <div className=" space-y-8">
      {data.amaQuestions.map((question) => (
        <QuestionItem editable={true} key={question.id} question={question} />
      ))}

      <Divider />
    </div>
  )
}
