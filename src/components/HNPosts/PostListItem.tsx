import * as React from 'react'
import { A } from '~/components/Typography'
import Grid from '~/components/Grid'
import Byline from '../HNPost/Byline'
import { HNPost } from '~/pages/hn'

interface Props {
  post: HNPost
}

export const PostListItem = React.memo((props: Props) => {
  const { post } = props

  return (
    <Grid gap={4}>
      <A href={post.url} target="_blank" rel="noopener noreferrer">
        {post.title}
      </A>

      <Byline post={post} />
    </Grid>
  )
})
