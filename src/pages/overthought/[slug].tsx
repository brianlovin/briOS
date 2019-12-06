 
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import unified from 'unified'
import parse from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import stringify from 'remark-stringify'
import { NextSeo } from 'next-seo';
import { BlogPost } from '../../types';
import { getPostBySlug } from '../../data/ghost'
import Page, { ContentContainer, SectionHeading } from '../../components/Page';
import { H1, Larr, Subheading, A } from '../../components/Typography'
import { FeaturedImage, ReadingTime } from '../../components/OverthoughtPreviewCard/style'
import Markdown from '../../components/Markdown';
import PostShareButtons from '../../components/PostShareButtons';
import Head from 'next/head';

interface Props {
  post: BlogPost;
  slug: string;
};

export function OverthoughtPost(props: Props) {
  const initialData = props.post
  const { data: post } = useSWR(`${props.slug}`, getPostBySlug, { initialData })
  
  if (!post) return (
    <Page withHeader>
      <ContentContainer>
        <SectionHeading>
          
          <H1 style={{ marginTop: 0 }}>Post not Found</H1>

          <Link href={'/overthought'}>
            <A>
              <Subheading><Larr /> Back to Overthought</Subheading>
            </A>
          </Link>
        </SectionHeading>
      </ContentContainer>
    </Page>
  )

  const md = unified()
    .use(parse)
    .use(rehype2remark)
    .use(stringify)
    .processSync(post.html)
    .toString()

  console.log({ post })

  return (
    <Page withHeader>
      <NextSeo
        title={post.title}
        description={post.custom_excerpt || post.excerpt}
        canonical={post.canonical_url}
        openGraph={{
          url: post.canonical_url,
          title: post.title,
          description: post.custom_excerpt || post.excerpt,
          images: post.feature_image && [
            {
              url: post.feature_image,
              alt: post.title,
            },
          ],
          site_name: "Overthought",
        }}
      />
      <ContentContainer>
        <SectionHeading>
          <Link href={'/overthought'}>
            <a>
              <Subheading><Larr /> Overthought</Subheading>
            </a>
          </Link>
          
          <div style={{ paddingBottom: '64px' }} />

          {post.feature_image && <FeaturedImage src={`https://overthought.ghost.io${post.og_image}`} />}
          <H1 style={{ marginTop: 0 }}>{post.title}</H1>
          <ReadingTime>{post.reading_time} minute read</ReadingTime>
          <div style={{ padding: '16px '}} />
        </SectionHeading>
        <Markdown>
          {md}
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