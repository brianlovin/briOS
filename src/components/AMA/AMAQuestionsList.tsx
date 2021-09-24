import * as React from 'react'
import { useGetAmaQuestionsQuery, AmaStatus } from '~/graphql/types.generated'
import FullscreenLoading from '../FullscreenLoading'
import ListContainer from '../ListDetail/ListContainer'
import TitleBar from '../ListDetail/TitleBar'
import { useRouter } from 'next/router'
import ListItem from '../ListDetail/ListItem'

export function AMAQuestionsList() {
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)
  const router = useRouter()

  const { data, error } = useGetAmaQuestionsQuery({
    variables: { status: AmaStatus.Answered },
  })

  if (error) return null

  if (!data || !data.amaQuestions) return <FullscreenLoading />

  const { amaQuestions: questions } = data

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <TitleBar
        scrollContainerRef={scrollContainerRef}
        title="Ask Me Anything"
      />

      <div className="lg:p-3 lg:space-y-1">
        {questions.map((question) => {
          const active = router.query?.id === question.id.toString() // post ids are numbers

          return (
            <ListItem
              key={question.id}
              href="/ama/[id]"
              as={`/ama/${question.id}`}
              title={question.question}
              description={null}
              byline={question.updatedAt}
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
}
