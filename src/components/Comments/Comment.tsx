import deepmerge from 'deepmerge'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { Avatar } from '~/components/Avatar'
import Button, { PrimaryButton } from '~/components/Button'
import { Textarea } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import {
  Comment as CommentProp,
  CommentType,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from '~/graphql/types.generated'
import { timestampToCleanTime } from '~/lib/transformers'

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

  const schema = deepmerge(defaultSchema, {
    attributes: { '*': ['className'] },
  })

  const [deleteComment] = useDeleteCommentMutation({
    variables: { id: comment.id },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteComment: true,
    },
    update(cache) {
      const { comments } = cache.readQuery({
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
          <Avatar
            user={comment.author}
            src={comment.author.avatar}
            width={40}
            height={40}
            quality={100}
            layout="fixed"
            className="rounded-full"
          />
          <div className="flex space-x-2">
            <p className="font-medium leading-snug text-primary">
              {comment.author.name}
            </p>
            <p className="leading-snug text-quaternary" title={createdAt.raw}>
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeSanitize, schema]]}
          children={comment.text}
          components={{
            h1: 'p',
            h2: 'p',
            h3: 'p',
            h4: 'p',
            h5: 'p',
            h6: 'p',
            code({ node, inline, className, children, ...props }) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          }}
          className="flex-grow leading-normal prose comment pl-14"
        />
      )}
    </div>
  )
})
