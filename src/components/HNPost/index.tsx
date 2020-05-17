import * as React from 'react'
import Link from 'next/link'
import { H3, Small } from '~/components/Typography'
import Grid from '~/components/Grid'
import { Comment } from './Comment'
import GlobalMarkdownStyles from '../GlobalStyles/markdown'
import Divider from '../Divider'
import { CenteredColumn } from '../Layouts'
import Byline from './Byline'
import { HNPost as HNPostType } from '~/pages/hn'

interface Props {
  post: HNPostType
}

export function HNPost(props: Props) {
  const { post } = props

  // trim things down to a readable amount
  const comments = post.comments.slice(0, 8)

  return (
    <React.Fragment>
      <GlobalMarkdownStyles />
      <CenteredColumn gap={32} data-cy="bookmarks">
        <Grid gap={32}>
          <Grid gap={16}>
            <Link href={'/hn'}>
              <a>
                <Small>&larr; Back</Small>
              </a>
            </Link>
            <H3>{post.title}</H3>
            <Byline post={post} />
          </Grid>
        </Grid>

        <Divider />

        <div>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </CenteredColumn>
    </React.Fragment>
  )
}
