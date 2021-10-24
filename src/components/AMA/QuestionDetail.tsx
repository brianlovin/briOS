import * as React from 'react'
import { useRouter } from 'next/router'
import { CommentType, useGetQuestionQuery } from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Detail } from '~/components/ListDetail/Detail'
import { Comments } from '../Comments'
import { QuestionActions } from './QuestionActions'
import { Avatar } from '../Avatar'

export function QuestionDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const router = useRouter()
  const { data, loading, error } = useGetQuestionQuery({ variables: { id } })

  React.useEffect(() => {
    if (!loading && !data?.question) router.push('/ama')
  }, [loading])

  if (error || loading) {
    return null
  }

  if (!data || !data?.question) {
    return null
  }

  const { question } = data

  return (
    <Detail.Container ref={scrollContainerRef}>
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
            <p className="prose text-primary">{question.description}</p>
          )}
        </Detail.Header>
      </Detail.ContentContainer>

      <Comments refId={question.id} type={CommentType.Question} />
    </Detail.Container>
  )
}
