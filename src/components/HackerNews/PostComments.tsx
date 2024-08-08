import * as React from 'react'

import { PostComment } from './PostComment'

export function PostComments({ comments }) {
  return (
    <div className="relative flex flex-1 flex-col pb-24">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col space-y-8 divide-y divide-gray-150 dark:divide-gray-800 md:space-y-12">
        {comments &&
          comments.length > 0 &&
          comments.map((comment) => (
            <PostComment key={comment.id} comment={comment} />
          ))}
        {comments.length === 0 && (
          <p className="text-quaternary p-8">No comments yet...</p>
        )}
      </div>
    </div>
  )
}
