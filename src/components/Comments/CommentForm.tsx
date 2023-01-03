import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ErrorAlert } from '~/components/Alert'
import { CommentButton } from '~/components/Button'
import { Textarea } from '~/components/Input'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import {
  CommentType,
  GetCommentsQuery,
  useAddCommentMutation,
  useViewerQuery,
} from '~/graphql/types.generated'
import { useDebounce } from '~/hooks/useDebounce'
import { timestampToCleanTime } from '~/lib/transformers'

interface Props {
  refId: string
  type: CommentType
  openModal: () => void
}

export function CommentForm({ refId, type, openModal }: Props) {
  const { data } = useViewerQuery()
  const [text, setText] = React.useState('')
  const [error, setError] = React.useState(null)

  const [handleAddComment] = useAddCommentMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      addComment: {
        __typename: 'Comment',
        id: uuidv4(),
        text,
        createdAt: timestampToCleanTime({ month: 'short' }).formatted,
        updatedAt: timestampToCleanTime({ month: 'short' }).formatted,
        viewerCanDelete: false,
        viewerCanEdit: false,
        author: {
          __typename: 'User',
          id: uuidv4(),
          username: data?.viewer?.username,
          avatar: data?.viewer?.avatar,
          name: data?.viewer?.name,
          role: data?.viewer?.role,
          isViewer: true,
        },
      },
    },
    update(cache, { data: { addComment } }) {
      const { comments } = cache.readQuery<GetCommentsQuery>({
        query: GET_COMMENTS,
        variables: { refId, type },
      })

      cache.writeQuery({
        query: GET_COMMENTS,
        variables: { refId, type },
        data: {
          comments: [...comments, addComment],
        },
      })
    },
  })

  function onSubmit(e) {
    e.preventDefault()

    // not signed in, save to localstorage
    if (!data?.viewer) {
      // persist everything to local storage so we don't lose it
      localStorage.setItem(refId, text)
      // pop the sign in modal
      return openModal()
    }

    setText('')
    localStorage.removeItem(refId)
    return handleAddComment({
      variables: { refId, type, text },
    })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return onSubmit(e)
    }
  }

  React.useEffect(() => {
    const localText = localStorage.getItem(refId)
    if (localText) {
      setText(localText)
    }
  }, [])

  const debouncedText = useDebounce(text, 500)

  React.useEffect(() => {
    localStorage.setItem(refId, debouncedText)
  }, [debouncedText])

  function handleChange(e) {
    return setText(e.target.value)
  }

  return (
    <div className="sticky bottom-0 flex flex-col pb-10 bg-white border-t filter-blur border-gray-150 bg-opacity-90 dark:border-gray-800 dark:bg-gray-900 sm:pb-0">
      <form
        className="flex items-center flex-none w-full max-w-3xl px-4 py-4 mx-auto space-x-4 md:px-6"
        onSubmit={onSubmit}
      >
        <div className="relative flex flex-none w-full">
          <Textarea
            data-cy="comment-form-textarea"
            placeholder="Write a comment..."
            value={text}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            style={{ paddingRight: '48px' }}
          />

          <div className="absolute bottom-1 right-1">
            <CommentButton
              data-cy="submit-comment-button"
              type="submit"
              disabled={text.trim().length === 0}
              size="small-square"
            >
              ↑
            </CommentButton>
          </div>
        </div>
        {error && <ErrorAlert>{error}</ErrorAlert>}
      </form>
    </div>
  )
}
