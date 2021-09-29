import * as React from 'react'
import { useRouter } from 'next/router'
import { useGetAmaQuestionsQuery, AmaStatus } from '~/graphql/types.generated'
import ListContainer from '~/components/ListDetail/ListContainer'
import ListItem from '~/components/ListDetail/ListItem'
import { AMATitlebar } from './AMATitlebar'

export function AMAQuestionsList() {
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)
  const router = useRouter()

  const { data, error } = useGetAmaQuestionsQuery({
    variables: { status: AmaStatus.Answered },
  })

  if (error) return null

  if (!data || !data.amaQuestions) return null

  const { amaQuestions: questions } = data
  return (
    <ListContainer onRef={setScrollContainerRef}>
      <AMATitlebar scrollContainerRef={scrollContainerRef} />

      <div className="lg:p-3 lg:space-y-1">
        {questions.map((question) => {
          const active = router.query?.id === question.id.toString() // post ids are numbers

          return (
            <ListItem
              key={question.id}
              href="/ama/[id]"
              as={`/ama/${question.id}`}
              title={question.text}
              description={null}
              byline={`${question.author.name} · ${question.updatedAt}`}
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
}
