import * as React from 'react'
import Link from 'next/link'
import { Post } from '~/graphql/types.generated'
import { ContentContainer, SectionHeading } from '~/components/Page'
import { H3, A, Rarr, Small } from '~/components/Typography'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SyntaxHighlighter from '~/components/SyntaxHighlighter'
import SEO from './SEO'
import List from '../List'
import Feedback from '../Feedback'
import { FeaturedImage } from './style'
import Grid from '~/components/Grid'
import GlobalPrismStyles from '~/components/GlobalStyles/prism'
import GlobalMarkdownStyles from '~/components/GlobalStyles/markdown'
import { format } from 'timeago.js'

interface Props {
  post: Post
  posts: Post[]
}

export default function PostView({ post, posts }: Props) {
  const filtered =
    posts && posts.length > 0 ? posts.filter((p) => p.slug !== post.slug) : []

  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
      <GlobalPrismStyles />
      <GlobalMarkdownStyles />
      <SEO post={post} />

      <ContentContainer data-cy="overthought-post">
        <Grid gap={32}>
          {post.feature_image && (
            <FeaturedImage
              alt={post.title}
              loading="lazy"
              src={post.feature_image}
            />
          )}
          <Grid gap={16}>
            <H3>{post.title}</H3>
            <Small>Updated {format(post.updated_at)}</Small>
          </Grid>
        </Grid>

        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <Grid gap={32}>
          <div />
          <div />
          <Feedback post={post} />
          <OverthoughtSubscribeBox />
          <Grid gap={24}>
            <H3>More from Overthought</H3>
            {filtered && <List posts={filtered} />}
            <Link href="/overthought" as="/overthought" passHref>
              <A>
                See all posts <Rarr />
              </A>
            </Link>
          </Grid>
        </Grid>
      </ContentContainer>
    </React.Fragment>
  )
}
