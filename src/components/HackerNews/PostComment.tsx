import * as React from 'react'

import { HackerNewsComment } from '~/graphql/types.generated'
interface Props {
  comment: HackerNewsComment
}

function LevelZeroComment({ comment }) {
  return (
    <div className="px-4 pt-8 md:pt-12 md:px-8">
      <a
        className="inline-block font-normal"
        id={comment.id}
        href={`#${comment.id}`}
      >
        <p className="text-sm text-quaternary">{`${comment.user} · ${comment.time_ago}`}</p>
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
  )
}

function ChildComment({ comment, level }) {
  let color
  switch (level) {
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
      <div
        className={`border-l-2 ${color} flex flex-shrink flex-col pl-4 mt-4`}
      >
        <a
          className="inline-block font-normal"
          id={comment.id}
          href={`#${comment.id}`}
        >
          <p className="text-sm text-quaternary">{`${comment.user} · ${comment.time_ago}`}</p>
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
    return <ChildComment level={level} comment={comment} />
  }
})
