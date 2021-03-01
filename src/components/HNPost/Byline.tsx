import * as React from 'react'
import Link from 'next/link'
import { format } from 'timeago.js'
import { HNPost } from '~/pages/hn'

interface Props {
  post: HNPost
}

export default function Byline(props: Props) {
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
    <div className="space-x-2 text-tertiary">
      <span>{timeAgo}</span>

      <span className="text-quaternary">·</span>

      <span>
        <Link href={`/hn/[id]`} as={`/hn/${post.id}`}>
          <a className="font-normal text-primary highlight-link-hover">{`${post.comments_count} comments`}</a>
        </Link>
      </span>
    </div>
  )
}
