import * as React from 'react'

import { EditQuestionDialog } from '~/components/AMA/EditQuestionDialog'
import Button from '~/components/Button'
import { GET_QUESTION } from '~/graphql/queries/questions'
import {
  ReactionType,
  useToggleReactionMutation,
} from '~/graphql/types.generated'

import { ReactionButton } from '../Button/ReactionButton'

function getReactionButton(question) {
  const [toggleReaction, { loading }] = useToggleReactionMutation()

  function handleClick() {
    if (loading) return

    toggleReaction({
      variables: {
        refId: question.id,
        type: ReactionType.Question,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        toggleReaction: {
          __typename: 'Question',
          ...question,
          reactionCount: question.viewerHasReacted
            ? question.reactionCount - 1
            : question.reactionCount + 1,
          viewerHasReacted: !question.viewerHasReacted,
        },
      },
      update(cache, { data: { toggleReaction } }) {
        cache.writeQuery({
          query: GET_QUESTION,
          variables: { id: question.id },
          data: {
            question: {
              ...question,
              ...toggleReaction,
            },
          },
        })
      },
    })
  }

  return (
    <ReactionButton
      id={question.id}
      loading={loading}
      count={question.reactionCount}
      hasReacted={question.viewerHasReacted}
      onClick={handleClick}
    />
  )
}

export function QuestionActions({ question }) {
  if (question.viewerCanEdit) {
    return (
      <div className="flex items-center space-x-2">
        {getReactionButton(question)}
        {question.viewerCanEdit && (
          <EditQuestionDialog
            question={question}
            trigger={<Button>Edit</Button>}
          />
        )}
      </div>
    )
  }

  return null
}
