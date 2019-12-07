import * as React from 'react'
import OverthoughtPreviewCard from '~/components/Overthought/Preview'
import { Grid } from './style'

export default function OverthoughtGrid({ truncate, ...props }) {
  const posts = truncate ? props.posts.slice(0, 3) : props.posts
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