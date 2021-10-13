import * as React from 'react'
import Image from 'next/image'
import { Comment as CommentProp } from '~/graphql/types.generated'
import { MoreHorizontal } from 'react-feather'
import { GhostButton } from '../Button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import deepmerge from 'deepmerge'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import SyntaxHighlighter from '../SyntaxHighlighter'

interface Props {
  comment: CommentProp
}

export const Comment = React.memo(function MemoComment({ comment }: Props) {
  const schema = deepmerge(defaultSchema, {
    attributes: { '*': ['className'] },
  })

  return (
    <div className="flex flex-col space-y-1">
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
          <GhostButton size="small-square">
            <MoreHorizontal size={16} />
          </GhostButton>
        )}
      </div>

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
    </div>
  )
})
