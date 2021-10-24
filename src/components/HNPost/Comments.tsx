import * as React from 'react'
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter'
import { HNComment } from './Comment'

export function HNComments({ comments }) {
  return (
    <>
      <SyntaxHighlighter data={comments} />
      <div className="relative flex flex-col flex-1 pb-24 border-t dark:border-gray-800 border-gray-150">
        <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto space-y-8 divide-y divide-gray-150 md:space-y-12 xl:divide-y-0 dark:divide-gray-800">
          {comments &&
            comments.length > 0 &&
            comments.map((comment) => (
              <HNComment key={comment.id} comment={comment} />
            ))}
          {comments.length === 0 && (
            <p className="p-8 text-quaternary">No comments yet...</p>
          )}
        </div>
      </div>
    </>
  )
}
