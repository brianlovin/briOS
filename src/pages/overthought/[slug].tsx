 
import * as React from 'react';
import { BlogPost } from '../../types';
import { getPostBySlug } from '../../data/ghost'
import Page, { ContentContainer, SectionHeading, Heading, Subheading, Larr } from '../../components/Page';
import Link from 'next/link';
import { FeaturedImage, ReadingTime } from '../../components/OverthoughtPreviewCard/style'
import Markdown from '../../components/Markdown';
import PostShareButtons from '../../components/PostShareButtons';

type Props = {
  post: BlogPost,
};

export function OverthoughtPost({ post }) {
  return (
    <Page withHeader>
      <ContentContainer>
        <SectionHeading>
          <Link href={'/overthought'}>
            <a>
              <Subheading><Larr /> Overthought</Subheading>
            </a>
          </Link>
          
          <div style={{ paddingBottom: '64px' }} />

          {post.feature_image && <FeaturedImage src={`https://overthought.ghost.io${post.og_image}`} />}
          <Heading style={{marginTop: '24px'}}>{post.title}</Heading>
          <ReadingTime>{post.reading_time} minute read</ReadingTime>
          <div style={{ padding: '16px '}} />
        </SectionHeading>
        <Markdown escapeHtml={false}>
          {post.html}
        </Markdown>

        <SectionHeading>
          <PostShareButtons route={`overthought/${post.slug}`} title={post.title} />
        </SectionHeading>
      </ContentContainer>
    </Page>
  )
}

OverthoughtPost.getInitialProps = async ({ query }) => {
  const post = await getPostBySlug(query.slug);
  return { post: post }
}

export default OverthoughtPost