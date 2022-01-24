import Link from 'next/link'
import { NextSeo } from 'next-seo'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import routes from '~/config/routes'
import { baseUrl } from '~/config/seo'
import { useGetHackerNewsPostQuery } from '~/graphql/types.generated'

import { PostByline } from './PostByline'
import { PostComments } from './PostComments'
import { HackerNewsSubscriptionForm } from './SubscriptionForm'

export function PostDetail({ id }) {
  const { data, loading, error } = useGetHackerNewsPostQuery({
    variables: { id },
  })

  if (loading) return <Detail.Loading />
  if (!data?.hackerNewsPost || error) return <Detail.Null />

  const { hackerNewsPost: post } = data
  const { comments } = post

  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  return (
    <>
      <NextSeo
        title={post.title}
        description={
          post.content || `${post.comments_count} comments · ${post.domain}`
        }
        openGraph={{
          title: post.title,
          url: `${baseUrl}/hn/${post.id}`,
          description:
            post.content || `${post.comments_count} comments · ${post.domain}`,
          images: [
            {
              url: routes.hn.seo.image,
              alt: routes.hn.seo.description,
            },
          ],
        }}
      />

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
            <Link href={post.url}>
              <a target="_blank" rel="noopener noreferrer" className="block">
                <Detail.Title ref={titleRef}>{post.title}</Detail.Title>
              </a>
            </Link>
            <PostByline post={post} />
            {post.content && (
              <div
                className="comment prose opacity-70"
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

        <div className="border-t border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-3xl p-4">
            <HackerNewsSubscriptionForm />
          </div>
        </div>
      </Detail.Container>
    </>
  )
}
