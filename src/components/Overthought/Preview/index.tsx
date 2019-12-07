import * as React from 'react'
import Link from 'next/link'
import { H4, P } from '~/components/Typography'
import { Card, PreviewImage, ReadingTime } from './style'

export default function OverthoughtGrid({ post }) {
  return (
    <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
      <a>
        <Card style={{ height: '100%' }}>
          {post.feature_image && <PreviewImage src={post.feature_image} />}
          <H4>{post.title}</H4>
          <P>{post.custom_excerpt || post.excerpt}</P>
          <ReadingTime>{post.reading_time} minute read</ReadingTime>
        </Card>
      </a>
    </Link>
  )
}