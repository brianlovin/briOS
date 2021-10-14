import * as React from 'react'

export interface HNComment {
  id: string
  user: string
  comments_count: number
  comments: [HNComment]
  time_ago: string
  level: number
  content: string
}

interface Props {
  comment: HNComment
}

function LevelZeroComment({ comment }) {
  return (
    <div className="px-4 pt-12">
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
      {comment.comments.length > 0 &&
        comment.comments.map((comment) => (
          <HNComment comment={comment} key={comment.id} />
        ))}
    </div>
  )
}

function ChildComment({ comment, level }) {
  let color = 'border-gray-300'
  switch (level) {
    case 2: {
      color = 'border-gray-200'
      break
    }
    case 3: {
      color = 'border-gray-150'
      break
    }
    default: {
      color = 'border-gray-300'
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
        {comment.comments.length > 0 &&
          comment.comments.map((comment) => (
            <HNComment comment={comment} key={comment.id} />
          ))}
      </div>
    </>
  )
}

export const HNComment = React.memo((props: Props) => {
  const { comment } = props

  if (!comment) return null

  const { level } = comment

  if (level === 0) {
    return <LevelZeroComment comment={comment} />
  } else {
    return <ChildComment level={level} comment={comment} />
  }
})
