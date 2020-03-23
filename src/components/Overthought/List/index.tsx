import * as React from 'react'
import { format } from 'timeago.js'
import { BlogPost } from '~/types'
import Link from 'next/link'
import { Li, Ul, Small } from '~/components/Typography'

interface Props {
  posts: BlogPost[]
}

export default function OverthoughtList({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  return (
    <Ul style={{ listStyleType: 'none', marginLeft: 0 }}>
      {posts.map((post) => (
        <Li key={post.id}>
          <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
          {post.excerpt && <div>{post.excerpt}</div>}
          <Small as={'span'}>Updated {format(post.updated_at)}</Small>
        </Li>
      ))}
    </Ul>
  )
}
