import * as React from 'react'
import { useRouter } from 'next/router'
import { CommentType, useGetAmaQuestionQuery } from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Detail } from '~/components/ListDetail/Detail'
import { Comments } from '../Comments'

export function AMADetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const router = useRouter()
  const { data, loading, error } = useGetAmaQuestionQuery({ variables: { id } })

  React.useEffect(() => {
    if (!loading && !data?.amaQuestion) router.push('/ama')
  }, [loading])

  if (error || loading) {
    return null
  }

  if (!data || !data?.amaQuestion) {
    return null
  }

  return (
    <Detail.Container ref={scrollContainerRef}>
      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/writing'}
        magicTitle
        title={data?.amaQuestion.text}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>{data?.amaQuestion.text}</Detail.Title>
          <span className="inline-block leading-snug text-tertiary">
            {data?.amaQuestion.updatedAt}
          </span>
        </Detail.Header>
      </Detail.ContentContainer>

      <Comments refId={data.amaQuestion.id} type={CommentType.Question} />
    </Detail.Container>
  )
}
