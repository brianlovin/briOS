import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ErrorAlert } from '~/components/Alert'
import { Input } from '~/components/Input'
import { CommentType, useAddCommentMutation } from '~/graphql/types.generated'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'

interface Props {
  refId: string
  type: CommentType
  refetch: Function
}

export function CommentForm({ refId, type, refetch }: Props) {
  const [text, setText] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [handleAddComment] = useAddCommentMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      addComment: {
        __typename: 'Comment',
        id: uuidv4(),
        text,
        createdAt: '',
        updatedAt: '',
        author: {
          __typename: 'User',
          id: uuidv4(),
          username: 'foobar',
          avatar: 'brian',
          name: 'brian lovin',
        },
      },
    },
    onCompleted() {
      setIsSaving(false)
      refetch()
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    if (isSaving) return

    setText('')
    setIsSaving(true)
    return handleAddComment({
      variables: { refId, type, text },
    })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return onSubmit(e)
    }
  }

  const { user, isLoading } = useUser()

  return (
    <div className="sticky bottom-0 flex flex-col bg-white border-t dark:border-gray-800 dark:bg-gray-900 filter-blur bg-opacity-90 border-gray-150">
      <form
        className="flex items-center flex-none w-full max-w-3xl px-4 py-4 mx-auto space-x-4 md:px-6"
        onSubmit={onSubmit}
      >
        {!isLoading && user && (
          <div className="flex items-center flex-none">
            <Image
              src={user.picture}
              width={40}
              height={40}
              quality={100}
              layout="fixed"
              className="rounded-full "
            />
          </div>
        )}
        <Input
          placeholder="Leave a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {error && <ErrorAlert>{error}</ErrorAlert>}
      </form>
    </div>
  )
}
