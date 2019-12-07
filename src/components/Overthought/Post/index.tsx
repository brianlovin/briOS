 
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import { getFeaturedPosts } from '~/data/ghost'
import { BlogPost } from '~/types';
import { ContentContainer, SectionHeading } from '~/components/Page';
import { H1, Larr, Subheading } from '~/components/Typography'
import { FeaturedImage } from '~/components/Overthought/Preview/style'
import PostShareButtons from '~/components/ShareButtons';
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import Body from './Body'
import SEO from './SEO'
import Grid from '../Grid'
import GlobalStyles from '~/components/GlobalStyles';

interface Props {
  post: BlogPost;
};

export default function Post({ post }) {
  // fetch posts for the bottom of the view to show recent posts from the blog
  const { data: posts } = useSWR('/api/getFeaturedPosts', getFeaturedPosts)

  
  return (
    <React.Fragment>
      <ContentContainer data-cy="overthought-post">
        <SEO post={post} />
        <SectionHeading>
          <Link href={'/overthought'}>
            <a>
              <Subheading><Larr /> Overthought</Subheading>
            </a>
          </Link>
          
          <div style={{ paddingBottom: '64px' }} />

          {post.feature_image && <FeaturedImage src={`https://overthought.ghost.io${post.og_image}`} />}
          <H1 style={{ marginTop: 0 }}>{post.title}</H1>
          <div style={{ padding: '8px '}} />
        </SectionHeading>
        
        <GlobalStyles.MarkdownStyles />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />

        <SectionHeading>
          <PostShareButtons route={`overthought/${post.slug}`} title={post.title} />
          <OverthoughtSubscribeBox />
        </SectionHeading>

        <SectionHeading>
          <H1>Overthought</H1>
          <Subheading>Overthinking out loud about design, development, and building products.</Subheading>
        </SectionHeading>

      </ContentContainer>
      { posts && <Grid posts={posts} />}
    </React.Fragment>
  )
}