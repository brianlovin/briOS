import * as React from 'react'
import { PostListItem } from './PostListItem'
import { HNPost } from '~/pages/hn'
import Flex from '../Flex'

interface Props {
  posts: HNPost[]
}

const PostList = React.memo((props: Props) => {
  const { posts } = props

  return (
    <Flex flexDirection="column" gap={24}>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </Flex>
  )
})

export default PostList
