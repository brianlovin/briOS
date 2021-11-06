import * as React from 'react'

import { GET_POST } from '~/graphql/queries/posts'
import {
  ReactionType,
  useToggleReactionMutation,
} from '~/graphql/types.generated'

import { ReactionButton } from '../Button/ReactionButton'

function getReactionButton(post) {
  const [toggleReaction, { loading }] = useToggleReactionMutation()
  function handleClick() {
    if (loading) return

    toggleReaction({
      variables: {
        refId: post.id,
        type: ReactionType.Post,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        toggleReaction: {
          __typename: 'Post',
          ...post,
          reactionCount: post.viewerHasReacted
            ? post.reactionCount - 1
            : post.reactionCount + 1,
          viewerHasReacted: !post.viewerHasReacted,
        },
      },
      update(cache, { data: { toggleReaction } }) {
        cache.writeQuery({
          query: GET_POST,
          variables: { id: post.id },
          data: {
            post: {
              ...post,
              ...toggleReaction,
            },
          },
        })
      },
    })
  }

  return (
    <ReactionButton
      loading={loading}
      count={post.reactionCount}
      hasReacted={post.viewerHasReacted}
      onClick={handleClick}
    />
  )
}

export function PostActions({ post }) {
  return (
    <div className="flex items-center space-x-2">{getReactionButton(post)}</div>
  )
}
