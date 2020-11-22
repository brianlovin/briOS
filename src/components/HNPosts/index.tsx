import * as React from 'react'
import { PostListItem } from './PostListItem'
import { HNPost } from '~/pages/hn'

interface Props {
  posts: HNPost[]
}

const PostList = React.memo((props: Props) => {
  const { posts } = props

  return (
    <div className="flex flex-col space-y-6">
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </div>
  )
})

export default PostList
