import Link from 'next/link'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetHackerNewsPostQuery } from '~/graphql/types.generated'

import { PostByline } from './PostByline'
import { PostComments } from './PostComments'

export function PostDetail({ id }) {
  const { data, loading, error } = useGetHackerNewsPostQuery({
    variables: { id },
  })

  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  if (loading) return <Detail.Loading />
  if (!data?.hackerNewsPost || error) return <Detail.Null />

  const { hackerNewsPost: post } = data
  const { comments } = post

  return (
    <Detail.Container data-cy="post-detail" ref={scrollContainerRef}>
      <TitleBar
        backButtonHref="/hn"
        backButton
        globalMenu={false}
        magicTitle
        title={post.title}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Link
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Detail.Title ref={titleRef}>{post.title}</Detail.Title>
          </Link>
          <PostByline post={post} />
          {post.content && (
            <div
              className="prose comment opacity-70"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </Detail.Header>

        {post.url && (
          <div className="mt-6">
            <PrimaryButton
              size="large"
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon size={14} />
              <span>Visit</span>
            </PrimaryButton>
          </div>
        )}
      </Detail.ContentContainer>

      <PostComments comments={comments} />
    </Detail.Container>
  )
}
