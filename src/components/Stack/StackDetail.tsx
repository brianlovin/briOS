import * as React from 'react'
import Image from 'next/image'
import TitleBar from '~/components/ListDetail/TitleBar'
import { CommentType, useGetStackQuery } from '~/graphql/types.generated'
import { Comments } from '../Comments'
import { Detail } from '../ListDetail/Detail'
import Button from '../Button'
import { StackActions } from './StackActions'

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

  if (!data?.stack) {
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
        trailingAccessory={<StackActions stack={stack} />}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <div className="pb-4">
            <Image
              src={`/static/img/stack/${stack.image}`}
              width={48}
              height={48}
              layout="fixed"
              alt={`${stack.name} icon`}
              className={'rounded-xl'}
            />
          </div>
          <Detail.Title ref={titleRef}>{stack.name}</Detail.Title>

          <p className="prose text-primary">{stack.description}</p>

          <div className="mt-6">
            <Button href={stack.url}>Get</Button>
          </div>
        </Detail.Header>
      </Detail.ContentContainer>

      <Comments refId={stack.id} type={CommentType.Stack} />
    </Detail.Container>
  )
}
