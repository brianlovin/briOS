import * as React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div data-cy="overthought-not-found">
      <h1>Post not Found</h1>

      <Link href={'/overthought'} passHref>
        <a>&larr; Back to Overthought</a>
      </Link>
    </div>
  )
}
