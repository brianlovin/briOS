import Image from 'next/image'
import * as React from 'react'

import { DesignDetailMedia } from '~/components/AppDissection/DetailMedia'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { DesignDetailsPost } from '~/data/appDissections'
import { timestampToCleanTime } from '~/lib/transformers'

interface Props {
  post: DesignDetailsPost
}

export function AppDissectionDetail({ post }: Props) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const date = timestampToCleanTime({ timestamp: post.createdAt })

  return (
    <Detail.Container data-cy="app-detail" ref={scrollContainerRef}>
      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/app-dissection'}
        magicTitle
        title={post.title}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <div className="flex items-center space-x-6">
            <Image
              src={`/static/img/app-dissection/${post.slug}.jpeg`}
              width={80}
              height={80}
              layout="fixed"
              alt={`${post.title} icon`}
              className={'rounded-2xl'}
            />
            <div>
              <Detail.Title ref={titleRef}>{post.title}</Detail.Title>
              <span
                title={date.raw}
                className="text-tertiary inline-block leading-snug"
              >
                {date.formatted}
              </span>
            </div>
          </div>
        </Detail.Header>

        <div className="space-y-12">
          <div className="prose pt-12">
            <MarkdownRenderer children={post.description} />
          </div>

          {post.details.map((detail, i) => (
            <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
          ))}
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
