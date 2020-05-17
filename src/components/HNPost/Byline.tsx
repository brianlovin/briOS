import * as React from 'react'
import { Small } from '~/components/Typography'
import { HnPost } from '~/graphql/types.generated'
import Link from 'next/link'

interface Props {
  post: HnPost
}

export default function Byline(props: Props) {
  const { post } = props
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Small>Posted {post.time_ago}</Small>

      <Small style={{ padding: '0 8px', color: 'var(--text-placeholder)' }}>
        /
      </Small>

      <Small>
        <Link href={`/hn/${post.id}`}>
          <a>{`${post.comments_count} comments`}</a>
        </Link>
      </Small>

      {post.domain && (
        <React.Fragment>
          <Small style={{ padding: '0 8px', color: 'var(--text-placeholder)' }}>
            /
          </Small>
          <Small>{post.domain}</Small>
        </React.Fragment>
      )}
    </div>
  )
}
