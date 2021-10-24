import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useGetQuestionsQuery } from '~/graphql/types.generated'
import ListContainer from '~/components/ListDetail/ListContainer'
import ListItem from '~/components/ListDetail/ListItem'
import { AMATitlebar } from './AMATitlebar'

export function QuestionsList() {
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)
  const router = useRouter()

  const { data, error } = useGetQuestionsQuery()

  if (error) return null

  if (!data || !data.questions) return null

  const { questions } = data

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <AMATitlebar scrollContainerRef={scrollContainerRef} />

      <div className="lg:p-3 lg:space-y-1">
        {questions.map((question) => {
          const active = router.query?.id === question.id.toString() // post ids are numbers

          return (
            <ListItem
              key={question.id}
              href={'/ama/[id]'}
              as={`/ama/${question.id}`}
              title={question.title}
              description={null}
              byline={
                <div className="flex items-center space-x-2">
                  <Image
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
          )
        })}
      </div>
    </ListContainer>
  )
}
