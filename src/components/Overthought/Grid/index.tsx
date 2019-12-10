import * as React from 'react'
import OverthoughtPreviewCard from '~/components/Overthought/Preview'
import { ContentGrid } from '~/components/Page'

export default function OverthoughtGrid({ truncate, ...props }) {
  const posts = truncate ? props.posts.slice(0, 4) : props.posts
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