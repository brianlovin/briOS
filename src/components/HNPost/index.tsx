import * as React from 'react'
import Link from 'next/link'
import { H3, Small } from '~/components/Typography'
import { Comment } from './Comment'
import GlobalMarkdownStyles from '../GlobalStyles/markdown'
import Divider from '../Divider'
import { CenteredColumn } from '../Layouts'
import Byline from './Byline'
import { HNPost as HNPostType } from '~/pages/hn'
import HNSubscribeBox from '../HNSubscribe'
import Flex from '../Flex'

interface Props {
  post: HNPostType
}

export function HNPost(props: Props) {
  const { post } = props

  // trim things down to a readable amount
  const comments = post.comments.slice(0, 8)

  const cleanUrl = post.domain
    ? `${post.url}?ref=brianlovin.com`
    : `/hn/${post.url.split('=')[1]}`

  return (
    <React.Fragment>
      <GlobalMarkdownStyles />
      <CenteredColumn gap={32} data-cy="bookmarks">
        <Flex flexDirection="column" gap={32}>
          <Flex flexDirection="column" gap={16}>
            <Link href={'/hn'}>
              <a>
                <Small>&larr; Back</Small>
              </a>
            </Link>
            <a href={cleanUrl} target="blank" rel="noopener noreferrer">
              <H3>{post.title}</H3>
            </a>
            <Byline post={post} />
          </Flex>
        </Flex>

        <Divider />

        <div>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>

        <HNSubscribeBox />
      </CenteredColumn>
    </React.Fragment>
  )
}
