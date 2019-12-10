 
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import { getFeaturedPosts } from '~/data/ghost'
import { BlogPost } from '~/types';
import { ContentContainer, SectionHeading } from '~/components/Page';
import { H1, Larr, A, Rarr, Subheading } from '~/components/Typography'
import { FeaturedImage, ReadingTime } from '~/components/Overthought/Preview/style'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SEO from './SEO'
import Grid from '../Grid'
import GlobalStyles from '~/components/GlobalStyles';
import SyntaxHighlighter from '~/components/SyntaxHighlighter';
import { getDateObject } from '~/lib/getDateObject'

interface Props {
  post: BlogPost;
};

export default function Post({ post }) {
  // fetch posts for the bottom of the view to show recent posts from the blog
  const { data: posts } = useSWR('/api/getFeaturedPosts', getFeaturedPosts)
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
          {post.feature_image && <FeaturedImage src={post.feature_image} />}
          <H1 style={{ marginTop: 0 }}>{post.title}</H1>
          <ReadingTime>{datestring} · {post.reading_time}m read</ReadingTime>
          <div style={{ padding: '8px '}} />
        </SectionHeading>
        
        <div dangerouslySetInnerHTML={{ __html: post.html }} />

        <SectionHeading style={{ marginTop: '72px' }}>
          <OverthoughtSubscribeBox />
        </SectionHeading>

        <SectionHeading style={{ marginTop: '32px' }}>
          <H1>More from Overthought</H1>
          <Subheading>Overthinking out loud about design, development, and building products.</Subheading>
          <Subheading style={{ marginTop: '24px'}}>
            <Link href="/overthought">
              <A>View all posts <Rarr /></A>
            </Link>
          </Subheading>
        </SectionHeading>

      </ContentContainer>
      { posts && <Grid truncate={true} posts={posts} />}
    </React.Fragment>
  )
}