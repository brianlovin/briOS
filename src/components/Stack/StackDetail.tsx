import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { CommentType, useGetStackQuery } from '~/graphql/types.generated'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { PrimaryButton } from '~/components/Button'
import { StackActions } from './StackActions'
import { Link as LinkIcon } from 'react-feather'
import { StackUsedBy } from './StackUsedBy'
import { Tags } from '~/components/Tag'

export function StackDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const { data, loading } = useGetStackQuery({
    variables: {
      id,
    },
  })

  if (loading) {
    return <Detail.Loading />
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
          <Link href={stack.url}>
            <a className="inline-block">
              <Image
                src={stack.image}
                width={72}
                height={72}
                layout="fixed"
                alt={`${stack.name} icon`}
                className={'rounded-2xl'}
              />
            </a>
          </Link>
          <Link href={stack.url}>
            <a className="block">
              <Detail.Title ref={titleRef}>{stack.name}</Detail.Title>
            </a>
          </Link>

          <p className="prose text-primary">{stack.description}</p>

          {stack.tags && stack.tags.length > 0 && (
            <div className="pb-4">
              <Tags tags={stack.tags} />
            </div>
          )}

          <PrimaryButton size="large" href={stack.url}>
            <LinkIcon size={14} />
            <span>Visit</span>
          </PrimaryButton>

          <StackUsedBy stack={stack} />
        </Detail.Header>
      </Detail.ContentContainer>

      <Comments refId={stack.id} type={CommentType.Stack} />
    </Detail.Container>
  )
}
