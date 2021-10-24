import * as React from 'react'

import { DesignDetailMedia } from '~/components/DesignDetailMedia'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'

export function AppDissectionDetail({ post }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const date = new Date(post.createdAt).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Detail.Container ref={scrollContainerRef}>
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
          <Detail.Title ref={titleRef}>{post.title}</Detail.Title>
          <span className="inline-block leading-snug text-tertiary">
            {date}
          </span>
        </Detail.Header>

        <div className="space-y-12">
          <div className="pt-12 prose">
            <MarkdownRenderer>{post.description}</MarkdownRenderer>
          </div>

          {post.details.map((detail, i) => (
            <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
          ))}
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
