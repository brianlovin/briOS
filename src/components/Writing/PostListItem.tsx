import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'
import { Post } from '~/graphql/types.generated'

interface Props {
  post: Post
  active: boolean
}

export const PostListItem = React.memo<Props>(({ post, active }) => {
  return (
    <ListItem
      key={post.id}
      href="/writing/[slug]"
      as={`/writing/${post.slug}`}
      title={post.title}
      description={post.excerpt}
      byline={post.publishedAt}
      active={active}
    />
  )
})
