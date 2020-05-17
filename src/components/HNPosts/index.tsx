import * as React from 'react'
import { useGetTopHnPostsQuery } from '~/graphql/types.generated'
import Grid from '~/components/Grid'
import { PostListItem } from './PostListItem'
import FullscreenLoading from '../FullscreenLoading'

interface Props {
  sort: string
}

export default function PostList(props: Props) {
  const { sort } = props
  // pre-populate data from the cache, but check for any new data after
  // the page loads
  const { data, error } = useGetTopHnPostsQuery({
    fetchPolicy: 'cache-first',
    variables: { sort },
  })

  // this can happen if the route is navigated to from the client or if the
  // cache fails to populate for whatever reason
  if (!data || !data.hnPosts) return <FullscreenLoading />
  if (error) return null

  const { hnPosts: posts } = data

  return (
    <Grid gap={24}>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </Grid>
  )
}
