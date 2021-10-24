import * as React from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import deepmerge from 'deepmerge'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { CommentType, useGetQuestionQuery } from '~/graphql/types.generated'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { Detail } from '~/components/ListDetail/Detail'
import { Comments } from '~/components/Comments'
import { QuestionActions } from './QuestionActions'
import { Avatar } from '~/components/Avatar'
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter'

export function QuestionDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const router = useRouter()
  const { data, loading, error, refetch } = useGetQuestionQuery({
    variables: { id },
  })

  const schema = deepmerge(defaultSchema, {
    attributes: { '*': ['className'] },
  })

  React.useEffect(() => {
    if (!loading && !data?.question) router.push('/ama')
  }, [loading])

  if (loading) {
    return <Detail.Loading />
  }

  if (!data || !data?.question) {
    return null
  }

  const { question } = data

  return (
    <Detail.Container ref={scrollContainerRef}>
      <SyntaxHighlighter data={question} />

      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/writing'}
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
            <span className="text-tertiary">{data?.question.updatedAt}</span>
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
              className="prose comment"
            />
          )}
        </Detail.Header>
      </Detail.ContentContainer>

      <Comments
        refetch={refetch}
        refId={question.id}
        type={CommentType.Question}
      />
    </Detail.Container>
  )
}
