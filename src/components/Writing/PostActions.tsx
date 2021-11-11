import * as React from 'react'

import Button from '~/components/Button'
import { ReactionButton } from '~/components/Button/ReactionButton'
import { GET_POST } from '~/graphql/queries/posts'
import {
  ReactionType,
  UserRole,
  useToggleReactionMutation,
  useViewerQuery,
} from '~/graphql/types.generated'

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
      id={post.id}
      loading={loading}
      count={post.reactionCount}
      hasReacted={post.viewerHasReacted}
      onClick={handleClick}
    />
  )
}

function getEditButton(post) {
  const { data } = useViewerQuery()
  const isAdmin = data?.viewer?.role === UserRole.Admin

  if (!isAdmin) return null

  return (
    <Button href="/writing/[slug]/edit" as={`/writing/${post.slug}/edit`}>
      Edit
    </Button>
  )
}

export function PostActions({ post }) {
  return (
    <div className="flex items-center space-x-2">
      {getReactionButton(post)}
      {getEditButton(post)}
    </div>
  )
}
