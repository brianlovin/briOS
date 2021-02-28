import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import Link from 'next/link'

interface Props {
  posts: Post[]
}

export default function PostsList({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="flex flex-col space-y-8">
      {posts.map((post) => {
        const date = new Date(post.published_at).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

        return (
          <div className="flex flex-col space-y-1" key={post.id}>
            <span>
              <Link
                href="/writing/[slug]"
                as={`/writing/${post.slug}`}
                passHref
              >
                <a className="font-medium text-primary highlight-link-hover">
                  {post.title}
                </a>
              </Link>
            </span>
            {post.excerpt && (
              <p className="text-tertiary clamp-3">{post.excerpt}</p>
            )}
            <p className="text-quaternary">{date}</p>
          </div>
        )
      })}
    </div>
  )
}
