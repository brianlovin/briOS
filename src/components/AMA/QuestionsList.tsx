import { LayoutGroup, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { QuestionStatus, useGetQuestionsQuery } from '~/graphql/types.generated'

import { ListLoadMore } from '../ListDetail/ListLoadMore'
import { LoadingSpinner } from '../LoadingSpinner'
import { AMATitlebar } from './AMATitlebar'
import { QuestionListItem } from './QuestionListItem'

export const QuestionsContext = React.createContext({
  filterPending: false,
  setFilterPending: (bool: boolean) => {},
})

export function QuestionsList() {
  const router = useRouter()

  const [filterPending, setFilterPending] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const status = filterPending
    ? QuestionStatus.Pending
    : QuestionStatus.Answered

  const { data, error, loading, fetchMore, refetch } = useGetQuestionsQuery({
    variables: { filter: { status } },
  })

  // refetch questions whenever I toggle back and forth between answered/unanswered
  React.useEffect(() => {
    refetch()
  }, [status])

  function handleFetchMore() {
    return fetchMore({
      variables: {
        after: data.questions.pageInfo.endCursor,
        filter: { status },
      },
    })
  }

  React.useEffect(() => {
    if (isVisible) handleFetchMore()
  }, [isVisible])

  if (loading && !data?.questions) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <AMATitlebar scrollContainerRef={scrollContainerRef} />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </ListContainer>
    )
  }

  if (error) return null

  const { questions } = data

  const defaultContextValue = { filterPending, setFilterPending }

  return (
    <QuestionsContext.Provider value={defaultContextValue}>
      <ListContainer data-cy="questions-list" onRef={setScrollContainerRef}>
        <AMATitlebar scrollContainerRef={scrollContainerRef} />

        <LayoutGroup>
          <div className="lg:space-y-1 lg:p-3">
            {questions.edges.map((question) => {
              const active = router.query?.id === question.node.id.toString() // post ids are numbers

              return (
                <motion.div layout key={question.node.id}>
                  <QuestionListItem question={question.node} active={active} />
                </motion.div>
              )
            })}

            {data.questions.pageInfo.hasNextPage && (
              <ListLoadMore setIsVisible={setIsVisible} />
            )}
          </div>
        </LayoutGroup>
      </ListContainer>
    </QuestionsContext.Provider>
  )
}
