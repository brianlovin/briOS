import * as React from 'react'
import { format } from 'timeago.js'
import { Post } from '~/graphql/types.generated'
import Link from 'next/link'

interface Props {
  posts: Post[]
}

export default function OverthoughtList({ posts }: Props) {
  if (!posts || posts.length === 0) return null
  return (
    <div className="flex flex-col space-y-5">
      {posts.map((post) => (
        <div className="flex flex-col space-y-1" key={post.id}>
          <Link
            href="/overthought/[slug]"
            as={`/overthought/${post.slug}`}
            passHref
          >
            <a className="text-blue-600 dark:text-blue-500">{post.title}</a>
          </Link>
          {post.excerpt && <p className="clamp-2">{post.excerpt}</p>}
          <p className="p-small">Updated {format(post.updated_at)}</p>
        </div>
      ))}
    </div>
  )
}
