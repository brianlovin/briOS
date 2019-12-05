 
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import { BlogPost } from '../../types';
import { getPostBySlug } from '../../data/ghost'
import Page, { ContentContainer, SectionHeading } from '../../components/Page';
import { H1, Larr, Subheading } from '../../components/Typography'
import { FeaturedImage, ReadingTime } from '../../components/OverthoughtPreviewCard/style'
import Markdown from '../../components/Markdown';
import PostShareButtons from '../../components/PostShareButtons';
import Home from '..';

interface Props {
  post: BlogPost;
  slug: string;
};

export function OverthoughtPost(props: Props) {
  const initialData = props.post
  const { data: post } = useSWR(`${props.slug}`, getPostBySlug, { initialData })

  if (!post) return <Home />
  
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
          <H1>{post.title}</H1>
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
  return { post: post, slug: query.slug }
}

export default OverthoughtPost