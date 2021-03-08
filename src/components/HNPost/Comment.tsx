import * as React from 'react'
import { LeftDivider } from './style'

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

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

export const Comment = React.memo((props: Props) => {
  const [collapsed, setCollapsed] = React.useState(false)

  const { comment } = props

  if (!comment) return null

  const { level } = comment

  if (collapsed) {
    return (
      <div className={`${level > 0 ? 'pl-5' : 'pl-0'} relative mb-4`}>
        {level > 0 && (
          <LeftDivider level={level} onClick={() => setCollapsed(!collapsed)} />
        )}

        <div className="relative">
          {level === 0 && (
            <LeftDivider
              level={level}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
          <p>{`${comment.time_ago} by ${comment.user}`}</p>
          <p
            style={{ cursor: 'pointer', marginTop: '4px' }}
            onClick={() => setCollapsed(!collapsed)}
          >
            Expand
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${level > 0 ? 'pl-5' : 'pl-0'} relative block mb-4`}>
      {level > 0 && (
        <LeftDivider level={level} onClick={() => setCollapsed(!collapsed)} />
      )}

      <div className="relative mb-4">
        {level === 0 && (
          <LeftDivider level={level} onClick={() => setCollapsed(!collapsed)} />
        )}

        <ConditionalWrapper
          condition={level === 0}
          wrapper={(children) => (
            <a
              className="font-normal black-link"
              id={comment.id}
              href={`#${comment.id}`}
            >
              {children}
            </a>
          )}
        >
          <p className="mb-3 text-sm text-tertiary">{`${comment.time_ago} by ${comment.user}`}</p>
        </ConditionalWrapper>
        <div
          className={'prose'}
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
      </div>

      {comment.comments.length > 0 &&
        comment.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
    </div>
  )
})
