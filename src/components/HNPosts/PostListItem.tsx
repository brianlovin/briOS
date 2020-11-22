import * as React from 'react'
import Byline from '../HNPost/Byline'
import { HNPost } from '~/pages/hn'

interface Props {
  post: HNPost
}

export const PostListItem = React.memo((props: Props) => {
  const { post } = props

  return (
    <div className="flex flex-col space-y-1">
      <a href={post.url} target="_blank" rel="noopener noreferrer">
        {post.title}
      </a>

      <Byline post={post} />
    </div>
  )
})
