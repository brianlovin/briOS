import { AnimateSharedLayout, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Avatar } from '~/components/Avatar'
import { ListContainer } from '~/components/ListDetail/ListContainer'
import { ListItem } from '~/components/ListDetail/ListItem'
import { useGetQuestionsQuery } from '~/graphql/types.generated'

import { AMATitlebar } from './AMATitlebar'

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
      <ListContainer onRef={setScrollContainerRef}>
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
                    <ListItem
                      href={'/ama/[id]'}
                      as={`/ama/${question.id}`}
                      title={question.title}
                      description={null}
                      byline={
                        <div className="flex items-center space-x-2">
                          <Avatar
                            user={question.author}
                            src={question.author.avatar}
                            width={16}
                            height={16}
                            layout={'fixed'}
                            className="rounded-full"
                          />{' '}
                          <span>{question.author.name}</span>
                        </div>
                      }
                      active={active}
                    />
                  </motion.div>
                )
              })}
          </div>
        </AnimateSharedLayout>
      </ListContainer>
    </QuestionsContext.Provider>
  )
}
