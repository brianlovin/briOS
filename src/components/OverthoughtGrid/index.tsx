import * as React from 'react'
import OverthoughtPreviewCard from '../OverthoughtPreviewCard'
import { Grid } from './style'

export default function OverthoughtGrid({ posts }) {
  if (!posts || posts.length === 0) return null
  return (
    <Grid>
      <OverthoughtPreviewCard post={posts[0]} />
    </Grid>
  )
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