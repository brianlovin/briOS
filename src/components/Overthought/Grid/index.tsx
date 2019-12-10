import * as React from 'react'
import OverthoughtPreviewCard from '~/components/Overthought/Preview'
import { ContentGrid } from '~/components/Page'
import { BlogPost } from '~/types'

interface Props {
  truncate: boolean;
  posts: Array<BlogPost>;
}

export default function OverthoughtGrid({ truncate, ...props }: Props) {
  const posts = truncate ? props.posts.slice(0, 4) : props.posts
  console.log({ posts })
  return (
    <ContentGrid>
      {
        posts.map(post => (
          <OverthoughtPreviewCard key={post.id} post={post} />
        ))
      }
    </ContentGrid>
  )
}