import * as React from 'react'
import OverthoughtPreviewCard from '../Preview'
import { Grid } from './style'

export default function OverthoughtGrid({ posts }) {
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