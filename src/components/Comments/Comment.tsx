import * as React from 'react'
import Image from 'next/image'
import { Comment as CommentProp } from '~/graphql/types.generated'
import { MoreHorizontal } from 'react-feather'

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
          <div className="flex items-center justify-center p-2 text-gray-500 rounded-md cursor-pointer hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800">
            <MoreHorizontal size={16} />
          </div>
        )}
      </div>

      <div className="prose pl-14">{comment.text}</div>
    </div>
  )
})
