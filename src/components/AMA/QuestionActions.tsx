import * as React from 'react'

import { EditQuestionDialog } from '~/components/AMA/EditQuestionDialog'
import Button from '~/components/Button'

export function QuestionActions({ question }) {
  if (question.viewerCanEdit) {
    return (
      <EditQuestionDialog question={question} trigger={<Button>Edit</Button>} />
    )
  }

  return null
}
