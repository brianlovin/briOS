import * as React from 'react'
import { BlogPost } from '~/types'
import OverthoughtPreviewListItem from './ListItem'
import { ListGrid } from './style'

interface Props {
  posts: Array<BlogPost>;
}

export default function OverthoughtList({ posts }: Props) {
  return (
    <ListGrid>
      {
        posts.map(post => (
          <OverthoughtPreviewListItem key={post.id} post={post} />
        ))
      }
    </ListGrid>
  )
}