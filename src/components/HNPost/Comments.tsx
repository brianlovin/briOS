import * as React from 'react'
import SyntaxHighlighter from '../SyntaxHighlighter'
import { HNComment } from './Comment'

export function HNComments({ comments }) {
  return (
    <>
      <SyntaxHighlighter data={comments} />
      <div className="relative flex flex-col flex-1 border-t md:bg-gray-50 dark:border-gray-800 border-gray-150">
        <div className="flex flex-col flex-1 max-w-3xl mx-auto space-y-12 divide-y divide-gray-200">
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
