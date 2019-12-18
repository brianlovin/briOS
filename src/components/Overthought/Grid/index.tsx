import * as React from 'react'
import OverthoughtPreviewCard from '~/components/Overthought/PreviewCard'
import { ContentGrid, PreviewContentGrid } from '~/components/Page'
import { BlogPost } from '~/types'

interface Props {
  truncate: boolean;
  posts: Array<BlogPost>;
}

export default function OverthoughtGrid({ truncate, ...props }: Props) {
  const posts = truncate ? props.posts.slice(0, 4) : props.posts
  const Grid = truncate ? PreviewContentGrid : ContentGrid
  return (
    <Grid>
      {
        posts.map(post => (
          <OverthoughtPreviewCard key={post.id} post={post} />
        ))
      }
    </Grid>
  )
}