import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { ContentContainer } from '~/components/Page'
import { H3, Small } from '~/components/Typography'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SyntaxHighlighter from '~/components/SyntaxHighlighter'
import SEO from './SEO'
import Feedback from '../Feedback'
import { FeaturedImage } from './style'
import GlobalPrismStyles from '~/components/GlobalStyles/prism'
import GlobalMarkdownStyles from '~/components/GlobalStyles/markdown'
import { format } from 'timeago.js'
import Flex from '~/components/Flex'

interface Props {
  post: Post
}

export default function PostView({ post }: Props) {
  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
      <GlobalPrismStyles />
      <GlobalMarkdownStyles />
      <SEO post={post} />

      <ContentContainer data-cy="overthought-post">
        <Flex flexDirection="column" gap={32}>
          {post.feature_image && (
            <FeaturedImage
              alt={post.title}
              loading="lazy"
              src={post.feature_image}
            />
          )}
          <Flex flexDirection="column" gap={16}>
            <H3>{post.title}</H3>
            <Small>Updated {format(post.updated_at)}</Small>
          </Flex>
        </Flex>

        <div
          style={{ marginTop: '16px' }}
          className="markdown"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <Flex flexDirection="column" gap={32}>
          <div />
          <div />
          <Feedback post={post} />
          <OverthoughtSubscribeBox />
        </Flex>
      </ContentContainer>
    </React.Fragment>
  )
}
