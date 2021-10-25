import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { Tags } from '~/components/Tag'
import { CommentType, useGetStackQuery } from '~/graphql/types.generated'

import { StackActions } from './StackActions'
import { StackUsedBy } from './StackUsedBy'

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
    <Detail.Container data-cy="stack-detail" ref={scrollContainerRef}>
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
          <div className="flex items-center space-x-6">
            <Link href={stack.url}>
              <a className="inline-block">
                <Image
                  src={stack.image}
                  width={80}
                  height={80}
                  layout="fixed"
                  alt={`${stack.name} icon`}
                  className={'rounded-2xl'}
                />
              </a>
            </Link>
            <div className="flex flex-col space-y-1">
              <Link href={stack.url}>
                <a className="block">
                  <Detail.Title ref={titleRef}>{stack.name}</Detail.Title>
                </a>
              </Link>
              {stack.tags && stack.tags.length > 0 && (
                <Tags tags={stack.tags} />
              )}
            </div>
          </div>

          <p className="prose text-primary">{stack.description}</p>

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
