import * as React from 'react'

import { EditBookmarkDialog } from '~/components/Bookmarks/EditBookmarkDialog'
import Button from '~/components/Button'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import {
  ReactionType,
  UserRole,
  useToggleReactionMutation,
  useViewerQuery,
} from '~/graphql/types.generated'

import { ReactionButton } from '../Button/ReactionButton'

function getReactionButton(bookmark) {
  const [toggleReaction, { loading }] = useToggleReactionMutation()

  function handleClick() {
    if (loading) return

    toggleReaction({
      variables: {
        refId: bookmark.id,
        type: ReactionType.Bookmark,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        toggleReaction: {
          __typename: 'Bookmark',
          ...bookmark,
          reactionCount: bookmark.viewerHasReacted
            ? bookmark.reactionCount - 1
            : bookmark.reactionCount + 1,
          viewerHasReacted: !bookmark.viewerHasReacted,
        },
      },
      update(cache, { data: { toggleReaction } }) {
        cache.writeQuery({
          query: GET_BOOKMARK,
          variables: { id: bookmark.id },
          data: {
            bookmark: {
              ...bookmark,
              ...toggleReaction,
            },
          },
        })
      },
    })
  }

  return (
    <ReactionButton
      id={bookmark.id}
      loading={loading}
      count={bookmark.reactionCount}
      hasReacted={bookmark.viewerHasReacted}
      onClick={handleClick}
    />
  )
}

export function BookmarkActions({ bookmark }) {
  const { data } = useViewerQuery()
  const isAdmin = data?.viewer?.role === UserRole.Admin
  return (
    <div className="flex items-center space-x-2">
      {getReactionButton(bookmark)}
      {isAdmin && (
        <EditBookmarkDialog
          bookmark={bookmark}
          trigger={<Button data-cy="open-edit-bookmark-dialog">Edit</Button>}
        />
      )}
    </div>
  )
}
