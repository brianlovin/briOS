import * as React from 'react'
import Grid from '~/components/Grid'
import { Small } from '../Typography'
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
      <Grid
        gap={20}
        style={{
          paddingLeft: level > 0 ? '20px' : 0,
          position: 'relative',
        }}
      >
        {level > 0 && (
          <LeftDivider level={level} onClick={() => setCollapsed(!collapsed)} />
        )}

        <Grid gap={4} style={{ position: 'relative' }}>
          {level === 0 && (
            <LeftDivider
              level={level}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
          <Grid columns={'max-content'}>
            <Small>{`${comment.time_ago} by ${comment.user}`}</Small>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid
      gap={20}
      style={{
        paddingLeft: level > 0 ? '20px' : 0,
        position: 'relative',
      }}
    >
      {level > 0 && (
        <LeftDivider level={level} onClick={() => setCollapsed(!collapsed)} />
      )}

      <Grid gap={8} style={{ position: 'relative' }}>
        {level === 0 && (
          <LeftDivider level={level} onClick={() => setCollapsed(!collapsed)} />
        )}

        <ConditionalWrapper
          condition={level === 0}
          wrapper={(children) => (
            <a id={comment.id} href={`#${comment.id}`}>
              {children}
            </a>
          )}
        >
          <Grid columns={`max-content`}>
            <Small>{`${comment.time_ago} by ${comment.user}`}</Small>
          </Grid>
        </ConditionalWrapper>
        <Grid className={'markdown'}>
          <div
            style={{
              display: 'grid',
            }}
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        </Grid>
      </Grid>

      {comment.comments.length > 0 &&
        comment.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
    </Grid>
  )
})
