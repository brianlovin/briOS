import * as React from 'react'
import { format } from 'timeago.js'

import { HNPost } from '~/pages/hn'

interface Props {
  post: HNPost
}

export function PostByline(props: Props) {
  const { post } = props

  // the timestamp for the post will always be stale becuse we are statically
  // generating the hn pages. we can recalculate the time ago text whenever
  // the component mounts, so that the data loads instantly but the user won't
  // be misled about the published date
  const [timeAgo, setTimeAgo] = React.useState(format(post.time * 1000))

  React.useEffect(() => {
    setTimeAgo(format(post.time * 1000))
  }, [])

  return (
    <div className="flex space-x-2 text-tertiary">
      <p className="font-normal">{`${post.comments_count} comments`}</p>

      <span className="text-quaternary">·</span>

      <span>{timeAgo}</span>
    </div>
  )
}
