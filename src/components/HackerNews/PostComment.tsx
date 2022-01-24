import * as React from 'react'

import { HackerNewsComment } from '~/graphql/types.generated'
import { timestampToCleanTime } from '~/lib/transformers'
interface Props {
  comment: HackerNewsComment
}

function LevelZeroComment({ comment }: Props) {
  const date = timestampToCleanTime({ timestamp: comment.time * 1000 })

  return (
    <div className="px-4 pt-8 md:px-8 md:pt-12">
      <a
        className="inline-block font-normal"
        id={comment.id}
        href={`#${comment.id}`}
      >
        <p className="text-quaternary text-sm">{`${comment.user}`}</p>
      </a>
      <div
        className={'comment prose pt-1'}
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      {comment.comments &&
        comment.comments.length > 0 &&
        comment.comments.map((comment) => (
          <PostComment comment={comment} key={comment.id} />
        ))}
    </div>
  )
}

function ChildComment({ comment }: Props) {
  const date = timestampToCleanTime({ timestamp: comment.time * 1000 })

  let color
  switch (comment.level) {
    case 2: {
      color = 'border-gray-200 dark:border-gray-700'
      break
    }
    case 3: {
      color = 'border-gray-150 dark:border-gray-800'
      break
    }
    default: {
      color = 'border-gray-300 dark:border-gray-600'
    }
  }

  return (
    <>
      <div className={`border-l-2 ${color} mt-4 flex shrink flex-col pl-4`}>
        <a
          className="inline-block font-normal"
          id={comment.id}
          href={`#${comment.id}`}
        >
          <p className="text-quaternary text-sm">{`${comment.user}`}</p>
        </a>
        <div
          className={'prose pt-1'}
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
        {comment.comments &&
          comment.comments.length > 0 &&
          comment.comments.map((comment) => (
            <PostComment comment={comment} key={comment.id} />
          ))}
      </div>
    </>
  )
}

export const PostComment = React.memo((props: Props) => {
  const { comment } = props

  if (!comment) return null

  const { level } = comment

  if (level === 0) {
    return <LevelZeroComment comment={comment} />
  } else {
    return <ChildComment comment={comment} />
  }
})
