import Link from 'next/link'
import * as React from 'react'

import { Avatar } from '~/components/Avatar'
import Button, { PrimaryButton } from '~/components/Button'
import { Textarea } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import {
  Comment as CommentProp,
  CommentType,
  GetCommentsQuery,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from '~/graphql/types.generated'
import { timestampToCleanTime } from '~/lib/transformers'

import { MarkdownRenderer } from '../MarkdownRenderer'
import { CommentMenu } from './CommentMenu'

interface Props {
  comment: CommentProp
  refId: string
  type: CommentType
}

export const Comment = React.memo(function MemoComment({
  comment,
  refId,
  type,
}: Props) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editText, setEditText] = React.useState(comment.text)
  const [isSavingEdit, setIsSavingEdit] = React.useState(false)

  const [deleteComment] = useDeleteCommentMutation({
    variables: { id: comment.id },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteComment: true,
    },
    update(cache) {
      const { comments } = cache.readQuery<GetCommentsQuery>({
        query: GET_COMMENTS,
        variables: { refId, type },
      })

      cache.writeQuery({
        query: GET_COMMENTS,
        variables: { refId, type },
        data: {
          comments: comments.filter((o) => o.id !== comment.id),
        },
      })
    },
    onError(error) {},
  })

  const [editComment] = useEditCommentMutation({
    variables: { id: comment.id, text: editText },
    optimisticResponse: {
      __typename: 'Mutation',
      editComment: {
        __typename: 'Comment',
        ...comment,
        text: editText,
        author: {
          ...comment.author,
          __typename: 'User',
        },
      },
    },
    onError(error) {},
    onCompleted() {
      setIsSavingEdit(false)
      setIsEditing(false)
    },
  })

  function handleDelete() {
    deleteComment()
  }

  function handleEdit() {
    setIsEditing(true)
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      if (editText.trim().length === 0 || isSavingEdit) return
      return handleSaveEdit()
    }
    if (e.keyCode === 27 || e.key === 'Escape') {
      setIsEditing(false)
      setEditText(comment.text)
    }
  }

  function handleSaveEdit() {
    setIsSavingEdit(true)
    editComment()
  }

  const createdAt = timestampToCleanTime({
    month: 'short',
    timestamp: comment.createdAt,
  })

  return (
    <div className="flex flex-col space-y-0 group">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Link href={`/u/${comment.author.username}`} className="inline-flex">
            <Avatar
              user={comment.author}
              src={comment.author.avatar}
              width={40}
              height={40}
              quality={100}
              layout="fixed"
              className="rounded-full"
            />
          </Link>

          <div className="flex space-x-1">
            <Link
              href={`/u/${comment.author.username}`}
              className="font-semibold leading-snug text-primary"
            >
              <div className="flex break-all line-clamp-1">
                {comment.author.name}
              </div>
            </Link>
            <p className="leading-snug text-quaternary">·</p>
            <p
              className="leading-snug text-quaternary line-clamp-1"
              title={createdAt.raw}
            >
              {createdAt.formatted}
            </p>
          </div>
        </div>

        {(comment.viewerCanDelete || comment.viewerCanEdit) && (
          <CommentMenu
            comment={comment}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col space-y-3 pl-14">
          <Textarea
            onChange={(e) => setEditText(e.target.value)}
            value={editText}
            onKeyDown={onKeyDown}
          />
          <div className="flex justify-between">
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <PrimaryButton
              disabled={editText.trim().length === 0 || isSavingEdit}
              onClick={handleSaveEdit}
            >
              {isSavingEdit ? <LoadingSpinner /> : 'Save'}
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <MarkdownRenderer
          children={comment.text}
          className="flex-grow leading-normal prose comment pl-14"
          variant="comment"
        />
      )}
    </div>
  )
})
