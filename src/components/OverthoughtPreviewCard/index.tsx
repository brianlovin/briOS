import * as React from 'react'
import Link from 'next/link'
import Card from '../Card'
import { PreviewImage, ReadingTime } from './style'
import { Subheading, H3 } from '../Typography'

export default function OverthoughtGrid({ post }) {
  return (
    <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
      <a>
        <Card style={{ height: '100%' }}>
          {post.feature_image && <PreviewImage src={`https://overthought.ghost.io${post.og_image}`} />}
          <H3>{post.title}</H3>
          <Subheading>{post.custom_excerpt || post.excerpt}</Subheading>
          <ReadingTime>{post.reading_time} minute read</ReadingTime>
        </Card>
      </a>
    </Link>
  )
}