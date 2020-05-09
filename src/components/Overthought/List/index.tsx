import * as React from 'react'
import { format } from 'timeago.js'
import { Post } from '~/graphql/types.generated'
import Link from 'next/link'
import { A, Small, LineClamp } from '~/components/Typography'
import Grid from '~/components/Grid'

interface Props {
  posts: Post[]
}

export default function OverthoughtList({ posts }: Props) {
  if (!posts || posts.length === 0) return null
  return (
    <Grid gap={16}>
      {posts.map((post) => (
        <Grid gap={4} key={post.id}>
          <Link
            href="/overthought/[slug]"
            as={`/overthought/${post.slug}`}
            passHref
          >
            <A>{post.title}</A>
          </Link>
          {post.excerpt && <LineClamp lines={2}>{post.excerpt}</LineClamp>}
          <Small>Updated {format(post.updated_at)}</Small>
        </Grid>
      ))}
    </Grid>
  )
}
