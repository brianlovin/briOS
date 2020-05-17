import * as React from 'react'
import Link from 'next/link'
import { H3, Small } from '~/components/Typography'
import Grid from '~/components/Grid'
import { useGetHnPostQuery } from '~/graphql/types.generated'
import Comment from './Comment'
import GlobalMarkdownStyles from '../GlobalStyles/markdown'
import Divider from '../Divider'
import { CenteredColumn } from '../Layouts'
import Byline from './Byline'

interface Props {
  id: string
}

export default function HNPost(props: Props) {
  const { id } = props

  const { data, error } = useGetHnPostQuery({
    variables: { id },
  })

  if (!data || error) return null

  const { hnPost: post } = data

  // trim things down to a readable amount
  const comments = JSON.parse(post.comments).slice(0, 8)

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

        <Grid gap={32}>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </Grid>
      </CenteredColumn>
    </React.Fragment>
  )
}
