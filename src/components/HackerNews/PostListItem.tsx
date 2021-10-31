import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'
import { HackerNewsPost } from '~/graphql/types.generated'

interface Props {
  post: HackerNewsPost
  active: boolean
}

export const PostsListItem = React.memo<Props>(({ post, active }) => {
  function handleClick(e, post) {
    if (e.metaKey) {
      e.preventDefault()
      e.stopPropagation()
      window.open(post.url, '_blank').focus()
    }
  }

  return (
    <ListItem
      key={post.id}
      href="/hn/[id]"
      as={`/hn/${post.id}`}
      title={post.title}
      description={null}
      byline={post.domain}
      active={active}
      onClick={(e) => handleClick(e, post)}
    />
  )
})
