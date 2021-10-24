import * as React from 'react'
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter'
import { SEO } from './SEO'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetPostQuery } from '~/graphql/types.generated'
import { Detail } from '~/components/ListDetail/Detail'

export function PostContainer({ slug }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const { data, error, loading } = useGetPostQuery({ variables: { slug } })

  if (error) {
    return null
  }

  if (loading) {
    return <Detail.Loading />
  }

  if (!data?.post) {
    return (
      <div className="w-full max-h-screen overflow-y-auto bg-white dark:bg-black" />
    )
  }

  const { post } = data

  const date = new Date(post.published_at).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
      <SEO post={post} />
      <Detail.Container ref={scrollContainerRef}>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
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

          <div
            className="mt-8 prose lg:prose-lg"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </Detail.ContentContainer>
      </Detail.Container>
    </React.Fragment>
  )
}
