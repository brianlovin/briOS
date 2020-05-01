import * as React from 'react'
import Link from 'next/link'
import { Post } from '~/types/graphql'
import { ContentContainer, SectionHeading } from '~/components/Page'
import { H3, P, A, Rarr, H5 } from '~/components/Typography'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import { WithPrismStyles, WithMarkdownStyles } from '~/components/GlobalStyles'
import SyntaxHighlighter from '~/components/SyntaxHighlighter'
import SEO from './SEO'
import List from '../List'
import Feedback from '../Feedback'
import { FeaturedImage } from './style'

interface Props {
  post: Post
  posts: Post[]
}

export default function PostView({ post, posts }: Props) {
  const filtered = posts ? posts.filter((p) => p.slug !== post.slug) : []

  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
      <ContentContainer data-cy="overthought-post">
        <SEO post={post} />
        <SectionHeading>
          {post.feature_image && (
            <FeaturedImage
              alt={post.title}
              loading="lazy"
              src={post.feature_image}
            />
          )}
          <H3 style={{ marginTop: '0' }}>{post.title}</H3>
          <div style={{ padding: '4px 0' }} />
        </SectionHeading>

        <WithMarkdownStyles>
          <WithPrismStyles>
            <div
              className="markdown"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </WithPrismStyles>
        </WithMarkdownStyles>

        <SectionHeading style={{ marginTop: '32px' }}>
          <Feedback post={post} />
          <OverthoughtSubscribeBox />
        </SectionHeading>

        <SectionHeading style={{ marginTop: '32px' }}>
          <H5>More from Overthought</H5>
          {filtered && <List posts={filtered} />}
        </SectionHeading>

        <P>
          <Link href="/overthought" as="/overthought" passHref>
            <A>
              See all posts <Rarr />
            </A>
          </Link>
        </P>
      </ContentContainer>
    </React.Fragment>
  )
}
