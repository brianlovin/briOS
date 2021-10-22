import * as React from 'react'
import Image from 'next/image'
import {
  Comment as CommentProp,
  CommentType,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from '~/graphql/types.generated'
import { MoreHorizontal } from 'react-feather'
import Button, { GhostButton } from '../Button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import deepmerge from 'deepmerge'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import SyntaxHighlighter from '../SyntaxHighlighter'
import { CommentMenu } from './CommentMenu'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import toast from 'react-hot-toast'
import { Textarea } from '../Input'

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
      setIsEditing(false)
    },
  })

  function handleDelete() {
    deleteComment()
  }

  function handleEdit() {
    setIsEditing(true)
  }

  return (
    <div className="flex flex-col space-y-1 group">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Image
            src={comment.author.avatar}
            width={40}
            height={40}
            quality={100}
            layout="fixed"
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-medium leading-snug text-primary">
              {comment.author.name}
            </p>
            <p className="leading-snug text-quaternary">{comment.createdAt}</p>
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
          />
          <div className="flex justify-between">
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={editComment}>Save</Button>
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
          className="flex-grow prose comment pl-14"
        />
      )}
    </div>
  )
})
