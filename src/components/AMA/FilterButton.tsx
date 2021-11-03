import * as React from 'react'

import { GhostButton } from '~/components/Button'
import { QuestionStatus, useGetQuestionsQuery } from '~/graphql/types.generated'

import { LoadingSpinner } from '../LoadingSpinner'
import { QuestionsContext } from './QuestionsList'

export function QuestionsFilterButton() {
  const { setFilterPending, filterPending } = React.useContext(QuestionsContext)
  const { data, loading } = useGetQuestionsQuery({
    variables: {
      filter: { status: QuestionStatus.Pending },
    },
  })

  if (loading && !data?.questions) return <LoadingSpinner />

  return (
    <div className="relative" data-cy="pending-filter-button">
      {!filterPending && data.questions.pageInfo.totalCount > 0 && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full dark:border-gray-900" />
      )}
      <GhostButton
        aria-label={
          filterPending ? 'Show answered questions' : 'Show pending questions'
        }
        onClick={() => setFilterPending(!filterPending)}
        size="small-square"
      >
        {data.questions.pageInfo.totalCount}
      </GhostButton>
    </div>
  )
}
