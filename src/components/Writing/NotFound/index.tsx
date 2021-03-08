import * as React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div data-cy="post-not-found">
      <h1>Post not Found</h1>

      <Link href={'/writing'} passHref>
        <a>&larr; Back to all posts</a>
      </Link>
    </div>
  )
}
