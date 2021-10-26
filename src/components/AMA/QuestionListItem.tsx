import * as React from 'react'

import { Avatar } from '~/components/Avatar'
import { ListItem } from '~/components/ListDetail/ListItem'
import { Question } from '~/graphql/types.generated'

interface Props {
  question: Question
  active: boolean
}

export const QuestionListItem = React.memo<Props>(({ question, active }) => {
  return (
    <ListItem
      href={'/ama/[id]'}
      as={`/ama/${question.id}`}
      title={question.title}
      description={null}
      byline={
        <div className="flex items-center space-x-2">
          <Avatar
            user={question.author}
            src={question.author.avatar}
            width={16}
            height={16}
            layout={'fixed'}
            className="rounded-full"
          />{' '}
          <span>{question.author.name}</span>
        </div>
      }
      active={active}
    />
  )
})
