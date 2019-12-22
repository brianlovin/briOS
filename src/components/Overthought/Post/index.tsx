
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import { getFeaturedPosts } from '~/data/ghost'
import { BlogPost } from '~/types';
import { ContentContainer, SectionHeading } from '~/components/Page';
import { H1, H3, A, Rarr, LargeSubheading, Subheading } from '~/components/Typography'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import GlobalStyles from '~/components/GlobalStyles';
import SyntaxHighlighter from '~/components/SyntaxHighlighter';
import { getDateObject } from '~/lib/getDateObject'
import SEO from './SEO'
import Grid from '../Grid'
import Feedback from '../Feedback'
import { FeaturedImage } from './style'

interface Props {
  post: BlogPost;
};

export default function Post({ post }) {
  // fetch posts for the bottom of the view to show recent posts from the blog
  const { data: posts } = useSWR('/api/getFeaturedPosts', getFeaturedPosts)
  const filtered = posts ? posts.filter(p => p.slug !== post.slug) : []
  const { month, year, day } = getDateObject(post.published_at);
  const datestring = `${month.slice(0, 3)} ${day}, ${year}`;

  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
      <GlobalStyles.PrismStyles />
      <GlobalStyles.MarkdownStyles />

      <ContentContainer data-cy="overthought-post">
        <SEO post={post} />
        <SectionHeading>
          {post.feature_image && <FeaturedImage loading="lazy" src={post.feature_image} />}
          <H1 style={{ marginTop: 0 }}>{post.title}</H1>
          <LargeSubheading>{post.excerpt}</LargeSubheading>
          <div style={{ padding: '8px' }} />
        </SectionHeading>

        <div dangerouslySetInnerHTML={{ __html: post.html }} />

        <SectionHeading style={{ marginTop: '32px' }}>
          <Feedback post={post} />
          <OverthoughtSubscribeBox />
        </SectionHeading>

        <SectionHeading style={{ marginTop: '32px' }}>
          <H3>More from Overthought</H3>
          <Subheading>Overthinking out loud about design, development, and building products.</Subheading>
          <Subheading style={{ marginTop: '24px' }}>
            <Link href="/overthought">
              <A>View all posts <Rarr /></A>
            </Link>
          </Subheading>
        </SectionHeading>
      </ContentContainer>

      {filtered && <Grid truncate={true} posts={filtered} />}
    </React.Fragment>
  )
}