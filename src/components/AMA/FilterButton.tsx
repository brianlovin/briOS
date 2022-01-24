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
        <div className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-yellow-500 dark:border-gray-900" />
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
