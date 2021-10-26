import { AnimateSharedLayout, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { useGetQuestionsQuery } from '~/graphql/types.generated'

import { AMATitlebar } from './AMATitlebar'
import { QuestionListItem } from './QuestionListItem'

export const QuestionsContext = React.createContext({
  filterPending: false,
  setFilterPending: (bool: boolean) => {},
  pendingCount: 0,
})

export function QuestionsList() {
  const [filterPending, setFilterPending] = React.useState(false)
  const [pendingCount, setPendingCount] = React.useState(0)
  const [scrollContainerRef, setScrollContainerRef] = React.useState(null)
  const router = useRouter()

  const { data, error, loading } = useGetQuestionsQuery()

  React.useEffect(() => {
    if (data?.questions) {
      setPendingCount(data.questions.filter((q) => q.commentCount === 0).length)
    }
  }, [data])

  if (error || loading) return null

  if (!data || !data.questions) return null

  const { questions } = data

  const defaultContextValue = { filterPending, setFilterPending, pendingCount }

  return (
    <QuestionsContext.Provider value={defaultContextValue}>
      <ListContainer data-cy="questions-list" onRef={setScrollContainerRef}>
        <AMATitlebar scrollContainerRef={scrollContainerRef} />

        <AnimateSharedLayout>
          <div className="lg:p-3 lg:space-y-1">
            {questions
              .filter((q) =>
                filterPending ? q.commentCount === 0 : q.commentCount > 0
              )
              .map((question) => {
                const active = router.query?.id === question.id.toString() // post ids are numbers

                return (
                  <motion.div layout key={question.id}>
                    <QuestionListItem question={question} active={active} />
                  </motion.div>
                )
              })}
          </div>
        </AnimateSharedLayout>
      </ListContainer>
    </QuestionsContext.Provider>
  )
}
