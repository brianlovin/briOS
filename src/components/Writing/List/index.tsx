import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import Link from 'next/link'

interface Props {
  posts: Post[]
}

export default function PostsList({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  return (
    <>
      {posts.map((post) => {
        const date = new Date(post.published_at).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

        return (
          <div className="space-y-1" key={post.id}>
            <Link href="/writing/[slug]" as={`/writing/${post.slug}`} passHref>
              <a className="inline font-medium text-primary highlight-link-hover">
                {post.title}
              </a>
            </Link>
            {post.excerpt && <p className="text-tertiary">{post.excerpt}</p>}
            <p className="text-quaternary">{date}</p>
          </div>
        )
      })}
    </>
  )
}
