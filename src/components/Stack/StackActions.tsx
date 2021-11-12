import * as React from 'react'

import Button from '~/components/Button'
import { GET_STACK } from '~/graphql/queries/stack'
import {
  ReactionType,
  UserRole,
  useToggleReactionMutation,
  useViewerQuery,
} from '~/graphql/types.generated'

import { ReactionButton } from '../Button/ReactionButton'
import { EditStackDialog } from './EditStackDialog'

function getEditButton(stack) {
  const { data } = useViewerQuery()
  if (data?.viewer?.role === UserRole.Admin) {
    return <EditStackDialog stack={stack} trigger={<Button>Edit</Button>} />
  }
  return null
}

function getReactionButton(stack) {
  const [toggleReaction, { loading }] = useToggleReactionMutation()
  function handleClick() {
    if (loading) return

    toggleReaction({
      variables: {
        refId: stack.id,
        type: ReactionType.Stack,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        toggleReaction: {
          __typename: 'Stack',
          ...stack,
          reactionCount: stack.viewerHasReacted
            ? stack.reactionCount - 1
            : stack.reactionCount + 1,
          viewerHasReacted: !stack.viewerHasReacted,
        },
      },
      update(cache, { data: { toggleReaction } }) {
        cache.writeQuery({
          query: GET_STACK,
          variables: { slug: stack.slug },
          data: {
            stack: {
              ...stack,
              ...toggleReaction,
            },
          },
        })
      },
    })
  }

  return (
    <ReactionButton
      id={stack.id}
      loading={loading}
      count={stack.reactionCount}
      hasReacted={stack.viewerHasReacted}
      onClick={handleClick}
    />
  )
}

export function StackActions({ stack }) {
  return (
    <div className="flex items-center space-x-2">
      {getReactionButton(stack)}
      {getEditButton(stack)}
    </div>
  )
}
