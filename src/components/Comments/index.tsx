import { AnimateSharedLayout, motion } from 'framer-motion'
import * as React from 'react'
import {
  Comment as CommentPropType,
  CommentType,
} from '~/graphql/types.generated'
import { Comment } from './Comment'
import { CommentForm } from './CommentForm'

interface Props {
  comments: CommentPropType[]
  refId: string
  refetch: Function
}

export function Comments({ comments, refId, refetch }: Props) {
  return (
    <div className="relative flex flex-col flex-1">
      <div className="flex flex-col flex-1 w-full max-w-3xl px-4 py-8 mx-auto space-y-3 md:px-6">
        <AnimateSharedLayout>
          <div className="flex flex-col space-y-6">
            {comments.map((comment) => (
              <motion.div key={comment.id} layout>
                <Comment comment={comment} />
              </motion.div>
            ))}
            {comments.length === 0 && (
              <p className="text-quaternary">No comments yet...</p>
            )}
          </div>
        </AnimateSharedLayout>
      </div>
      <CommentForm
        refId={refId}
        refetch={refetch}
        type={CommentType.Bookmark}
      />
    </div>
  )
}
