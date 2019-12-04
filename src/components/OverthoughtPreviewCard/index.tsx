import * as React from 'react'
import Link from 'next/link'
import { Card, PreviewImage, ReadingTime, Title } from './style'
import { Subheading } from '../Page'

export default function OverthoughtGrid({ post }) {
  console.log({ post, image: post.feature_image })
  return (
    <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
      <a>
        <Card>
          {post.feature_image && <PreviewImage src={`https://overthought.ghost.io${post.og_image}`} />}
          <Title>{post.title}</Title>
          <Subheading>{post.custom_excerpt || post.excerpt}</Subheading>
          <ReadingTime>{post.reading_time} minute read</ReadingTime>
        </Card>
      </a>
    </Link>
  )
}