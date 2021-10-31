import deepmerge from 'deepmerge'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter'
import { CommentType, useGetPostQuery } from '~/graphql/types.generated'

import { Comments } from '../Comments'
import { PostSEO } from './PostSEO'

export function PostDetail({ slug }) {
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
    return null
  }

  const schema = deepmerge(defaultSchema, {
    attributes: { '*': ['className'] },
  })

  const { post } = data

  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
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
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <Detail.Title ref={titleRef}>{post.title}</Detail.Title>
            <span className="inline-block leading-snug text-tertiary">
              {post.publishedAt}
            </span>
          </Detail.Header>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeSanitize, schema]]}
            children={post.text}
            className="mt-8 prose lg:prose-lg"
          />

          {/* bottom padding to give space between post content and comments */}
          <div className="py-6" />
        </Detail.ContentContainer>

        <Comments refId={post.id} type={CommentType.Post} />
      </Detail.Container>
    </React.Fragment>
  )
}
