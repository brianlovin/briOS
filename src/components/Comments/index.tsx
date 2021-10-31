import * as React from 'react'

import { SignInDialog } from '~/components/SignInDialog'
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter'
import { CommentType, useGetCommentsQuery } from '~/graphql/types.generated'

import { Comment } from './Comment'
import { CommentForm } from './CommentForm'

interface Props {
  refId: string
  type: CommentType
  refetch?: () => void
}

export function Comments({ refId, type, refetch = null }: Props) {
  const [initialCommentsCount, setInitialCommentsCount] = React.useState(null)
  const messagesEndRef: React.RefObject<HTMLDivElement> = React.useRef(null)

  const { data, loading, error } = useGetCommentsQuery({
    variables: {
      refId,
      type,
    },
  })

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (data?.comments) {
      if (!initialCommentsCount) {
        return setInitialCommentsCount(data.comments.length)
      } else {
        if (data.comments.length > initialCommentsCount) {
          scrollToBottom()
        }
      }
    }
  }, [data])

  if (loading) return <p>Loading ...</p>
  if (error) return <p>Error...</p>

  const { comments } = data

  return (
    <>
      <SyntaxHighlighter data={comments} />
      <div className="relative flex flex-col flex-1 border-t dark:border-gray-800 border-gray-150">
        <div className="flex flex-col flex-1 w-full max-w-3xl px-4 pt-8 pb-4 mx-auto space-y-3 md:px-8">
          <div className="flex flex-col space-y-6">
            {comments &&
              comments.length > 0 &&
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  refId={refId}
                  type={type}
                  comment={comment}
                />
              ))}
            {comments.length === 0 && (
              <p className="pb-4 text-quaternary">No comments yet...</p>
            )}
          </div>
        </div>
        <div ref={messagesEndRef} />

        <SignInDialog>
          {({ openModal }) => (
            <CommentForm
              refetch={refetch}
              refId={refId}
              type={type}
              openModal={openModal}
            />
          )}
        </SignInDialog>
      </div>
    </>
  )
}
