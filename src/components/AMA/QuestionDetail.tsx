import deepmerge from 'deepmerge'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { Avatar } from '~/components/Avatar'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter'
import { CommentType, useGetQuestionQuery } from '~/graphql/types.generated'
import { timestampToCleanTime } from '~/lib/transformers'

import { QuestionActions } from './QuestionActions'

export function QuestionDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const { data, loading } = useGetQuestionQuery({
    variables: { id },
  })

  const schema = deepmerge(defaultSchema, {
    attributes: { '*': ['className'] },
  })

  if (loading) {
    return <Detail.Loading />
  }

  if (!data || !data?.question) {
    return null
  }

  const { question } = data
  const updatedAt = timestampToCleanTime({
    month: 'short',
    timestamp: data?.question.updatedAt,
  })

  return (
    <Detail.Container data-cy="question-detail" ref={scrollContainerRef}>
      <SyntaxHighlighter data={question} />

      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/ama'}
        magicTitle
        title={question.title}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
        trailingAccessory={<QuestionActions question={question} />}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <div className="flex items-center space-x-3">
            <Avatar
              user={question.author}
              src={question.author.avatar}
              width={32}
              height={32}
              layout={'fixed'}
              className="rounded-full"
            />{' '}
            <span className="font-medium text-secondary">
              {question.author.name}
            </span>
            <span title={updatedAt.raw} className="text-tertiary">
              {updatedAt.formatted}
            </span>
          </div>
          <Detail.Title ref={titleRef}>{question.title}</Detail.Title>
          {question.description && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeSanitize, schema]]}
              children={question.description}
              components={{
                h1: 'p',
                h2: 'p',
                h3: 'p',
                h4: 'p',
                h5: 'p',
                h6: 'p',
                code({ node, inline, className, children, ...props }) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
              className="leading-normal prose comment"
            />
          )}
        </Detail.Header>
      </Detail.ContentContainer>

      {question.viewerCanComment && (
        <Comments refId={question.id} type={CommentType.Question} />
      )}
    </Detail.Container>
  )
}
