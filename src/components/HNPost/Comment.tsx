import * as React from 'react'
import Grid from '~/components/Grid'
import { Small } from '../Typography'
import { LeftDivider } from './style'

interface Comment {
  id: string
  user: string
  comments_count: number
  comments: [Comment]
  time_ago: string
  level: number
  content: string
}

interface Props {
  comment: Comment
}

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

export const Comment = React.memo((props: Props) => {
  const [collapsed, setCollapsed] = React.useState(false)

  const { comment } = props
  const { level } = comment

  // I don't care about comment threads going this deep
  if (!comment || level > 3) return null

  if (collapsed) {
    return (
      <Grid
        gap={20}
        style={{
          paddingLeft: level > 0 ? '20px' : 0,
          position: 'relative',
        }}
      >
        {level > 0 && <LeftDivider onClick={() => setCollapsed(!collapsed)} />}

        <Grid gap={4}>
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
      {level > 0 && <LeftDivider onClick={() => setCollapsed(!collapsed)} />}

      <Grid gap={8}>
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
            style={{ maxWidth: `calc(640px - ${level * 20}px)` }}
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        </Grid>
      </Grid>

      {comment.comments.slice(0, 8).map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </Grid>
  )
})

export default Comment
