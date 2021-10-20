import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { CommentType, useGetStackQuery } from '~/graphql/types.generated'
import { Comments } from '../Comments'
import { Detail } from '../ListDetail/Detail'

export function StackDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const { data, loading } = useGetStackQuery({
    variables: {
      id,
    },
  })

  if (loading) {
    return null
  }

  const { stack } = data

  return (
    <Detail.Container ref={scrollContainerRef}>
      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/stack'}
        magicTitle
        title={stack.name}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>{stack.name}</Detail.Title>
        </Detail.Header>
      </Detail.ContentContainer>

      <Comments refId={stack.id} type={CommentType.Stack} />
    </Detail.Container>
  )
}
