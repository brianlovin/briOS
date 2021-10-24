import * as React from 'react'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'
import { EditQuestionDialog } from '~/components/AMA/EditQuestionDialog'
import Button from '../Button'

export function QuestionActions({ question }) {
  const { data } = useViewerQuery()
  if (
    data?.viewer?.role === UserRole.Admin ||
    question.author.id === data?.viewer?.id
  ) {
    return (
      <EditQuestionDialog question={question} trigger={<Button>Edit</Button>} />
    )
  }

  return null
}
