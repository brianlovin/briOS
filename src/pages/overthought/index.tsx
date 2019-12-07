import * as React from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import useSWR from 'swr'
import Page, { SectionHeading, ContentContainer } from '~/components/Page';
import OverthoughtGrid from '~/components/Overthought/Grid'
import { H1, Larr, Subheading } from '~/components/Typography'
import { getPosts } from '~/data/ghost'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import cacheSsrRes from '~/lib/cacheSsr';
import SEO from '~/components/Providers/SEO';

interface Props {
  posts?: Array<BlogPost>
}

function Overthought(props: Props) {
  const initialData = props.posts
  const { data: posts } = useSWR('/api/getPosts', getPosts, { initialData })
  
  return (
    <Page withHeader>
      <SEO />

      <ContentContainer data-cy="overthought">
        <SectionHeading>
          
          <Link href="/">
            <a>
              <Subheading><Larr /> Home</Subheading>
            </a>
          </Link>

          <div style={{ padding: '16px' }} />

          <H1>Overthought</H1>
          <Subheading>Overthinking out loud about design, development, and building products.</Subheading>
          
          <OverthoughtSubscribeBox />
        
        </SectionHeading>
      </ContentContainer>

      <OverthoughtGrid posts={posts} />
    </Page>
  );
}

Overthought.getInitialProps = async ({ res }) => {
  cacheSsrRes({ res })
  const posts = await getPosts();
  return { posts: posts }
}

export default Overthought