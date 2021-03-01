import * as React from 'react'
import Byline from '../HNPost/Byline'
import { HNPost } from '~/pages/hn'

interface Props {
  post: HNPost
}

export const PostListItem = React.memo((props: Props) => {
  const { post } = props

  return (
    <div className="space-y-1">
      <a
        className="font-medium text-primary highlight-link-hover"
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {post.title} {post.domain && `(${post.domain})`}
      </a>

      <Byline post={post} />
    </div>
  )
})
