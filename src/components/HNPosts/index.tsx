import * as React from 'react'
import Grid from '~/components/Grid'
import { PostListItem } from './PostListItem'
import { HNPost } from '~/pages/hn'

interface Props {
  posts: HNPost[]
}

const PostList = React.memo((props: Props) => {
  const { posts } = props

  return (
    <Grid gap={24}>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </Grid>
  )
})

export default PostList
