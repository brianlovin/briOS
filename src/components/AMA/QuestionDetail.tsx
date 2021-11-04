import Link from 'next/link'
import * as React from 'react'

import { Avatar } from '~/components/Avatar'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter'
import { CommentType, useGetQuestionQuery } from '~/graphql/types.generated'
import { timestampToCleanTime } from '~/lib/transformers'

import { MarkdownRenderer } from '../MarkdownRenderer'
import { QuestionActions } from './QuestionActions'

export function QuestionDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const { data, loading } = useGetQuestionQuery({
    variables: { id },
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
          <div className="flex items-center pb-2 space-x-4">
            <Link href={`/u/${question.author.username}`}>
              <a className="inline-flex">
                <Avatar
                  user={question.author}
                  src={question.author.avatar}
                  width={32}
                  height={32}
                  quality={100}
                  layout="fixed"
                  className="rounded-full"
                />
              </a>
            </Link>
            <div className="flex space-x-1">
              <Link href={`/u/${question.author.username}`}>
                <a className="inline-flex space-x-1">
                  <span className="font-semibold leading-snug text-primary">
                    {question.author.name}
                  </span>
                  <span className="inline-flex font-normal leading-snug text-tertiary">
                    @{question.author.username}
                  </span>
                </a>
              </Link>
              <p className="leading-snug text-quaternary">·</p>
              <p className="leading-snug text-quaternary" title={updatedAt.raw}>
                {updatedAt.formatted}
              </p>
            </div>
          </div>
          <Detail.Title ref={titleRef}>{question.title}</Detail.Title>
          {question.description && (
            <MarkdownRenderer
              children={question.description}
              className="leading-normal prose comment"
              variant="comment"
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
