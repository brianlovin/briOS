import * as React from 'react'

import { HackerNewsPost } from '~/graphql/types.generated'
import { timestampToCleanTime } from '~/lib/transformers'

interface Props {
  post: HackerNewsPost
}

export function PostByline(props: Props) {
  const { post } = props

  const date = timestampToCleanTime({ timestamp: post.time * 1000 })

  return (
    <div className="flex space-x-2 text-tertiary">
      <p className="font-normal">{`${post.comments_count} comments`}</p>

      <span className="text-quaternary">·</span>

      <span title={date.raw}>{date.formatted}</span>
    </div>
  )
}
