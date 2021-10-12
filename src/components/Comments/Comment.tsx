import * as React from 'react'
import Image from 'next/image'
import { Comment as CommentProp } from '~/graphql/types.generated'
import { MoreHorizontal } from 'react-feather'
import { GhostButton } from '../Button'

interface Props {
  comment: CommentProp
}

export const Comment = React.memo(function MemoComment({ comment }: Props) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Image
            src={comment.author.avatar}
            width={40}
            height={40}
            quality={100}
            layout="fixed"
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-medium leading-snug text-primary">
              {comment.author.name}
            </p>
            <p className="leading-snug text-quaternary">{comment.createdAt}</p>
          </div>
        </div>

        {(comment.viewerCanDelete || comment.viewerCanEdit) && (
          <GhostButton size="small-square">
            <MoreHorizontal size={16} />
          </GhostButton>
        )}
      </div>

      <div className="prose pl-14">{comment.text}</div>
    </div>
  )
})
