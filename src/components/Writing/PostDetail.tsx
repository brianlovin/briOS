import Link from 'next/link'
import * as React from 'react'

import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { CommentType, useGetPostQuery } from '~/graphql/types.generated'
import { timestampToCleanTime } from '~/lib/transformers'

import { PostActions } from './PostActions'
import { PostSEO } from './PostSEO'

export function PostDetail({ slug }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const { data, error, loading } = useGetPostQuery({ variables: { slug } })

  if (loading) {
    return <Detail.Loading />
  }

  if (!data?.post || error) {
    return <Detail.Null />
  }
  const { post } = data
  const publishedAt = timestampToCleanTime({ timestamp: post.publishedAt })
  return (
    <>
      <PostSEO post={post} />
      <Detail.Container data-cy="post-detail" ref={scrollContainerRef}>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
          magicTitle
          title={post.title}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
          trailingAccessory={<PostActions post={post} />}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <Detail.Title ref={titleRef}>{post.title}</Detail.Title>
            <span
              title={publishedAt.raw}
              className="inline-block leading-snug text-tertiary"
            >
              {publishedAt.formatted}
            </span>
          </Detail.Header>

          <MarkdownRenderer children={post.text} className="mt-8 prose" />

          {/* bottom padding to give space between post content and comments */}
          <div className="py-6" />
        </Detail.ContentContainer>

        <Comments refId={post.id} type={CommentType.Post} />
      </Detail.Container>
    </>
  )
}
