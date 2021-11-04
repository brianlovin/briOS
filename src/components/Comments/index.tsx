import * as React from 'react'
import { MessageCircle } from 'react-feather'

import { LoadingSpinner } from '~/components/LoadingSpinner'
import { SignInDialog } from '~/components/SignInDialog'
import { CommentType, useGetCommentsQuery } from '~/graphql/types.generated'
import { useWindowFocus } from '~/hooks/useWindowFocus'

import { Comment } from './Comment'
import { CommentForm } from './CommentForm'

interface Props {
  refId: string
  type: CommentType
}

export function Comments({ refId, type }: Props) {
  const [initialCommentsCount, setInitialCommentsCount] = React.useState(null)
  const messagesEndRef: React.RefObject<HTMLDivElement> = React.useRef(null)

  const { data, loading, error, refetch } = useGetCommentsQuery({
    variables: {
      refId,
      type,
    },
  })

  useWindowFocus({ onFocus: refetch })

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (data?.comments) {
      if (!initialCommentsCount) {
        setInitialCommentsCount(data.comments.length)
      } else {
        if (data.comments.length > initialCommentsCount) {
          scrollToBottom()
        }
      }
    }
  }, [data])

  if (loading) {
    return (
      <div className="relative flex flex-col flex-1 border-t dark:border-gray-800 border-gray-150">
        <div className="flex flex-col flex-1 w-full max-w-3xl px-4 py-8 mx-auto space-y-3 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  if (error) return <p>Error loading comments...</p>

  const { comments } = data

  return (
    <div className="relative flex flex-col flex-1 border-t dark:border-gray-800 border-gray-150">
      <div className="absolute px-8 py-2 transform -translate-x-1/2 bg-white dark:bg-black text-quaternary left-1/2 -top-5">
        <MessageCircle />
      </div>
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
            <p className="block pt-12 pb-16 text-center text-quaternary">
              No comments yet...
            </p>
          )}
        </div>
      </div>
      <div ref={messagesEndRef} />

      <SignInDialog>
        {({ openModal }) => (
          <CommentForm refId={refId} type={type} openModal={openModal} />
        )}
      </SignInDialog>
    </div>
  )
}
