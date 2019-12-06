import * as React from 'react'
import OverthoughtPreviewCard from '../OverthoughtPreviewCard'
import { Grid } from './style'

export default function OverthoughtGrid({ posts }) {
  return (
    <Grid>
      {
        posts.filter(post => post.slug.includes('fathom')).map(post => (
          <OverthoughtPreviewCard key={post.id} post={post} />
        ))
      }
    </Grid>
  )
}