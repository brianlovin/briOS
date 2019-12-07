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
import cacheSsrRes from '~/lib/cacheSsrRes';

interface Props {
  posts?: Array<BlogPost>
}

function Overthought(props: Props) {
  const initialData = props.posts
  const { data: posts } = useSWR('/api/getPosts', getPosts, { initialData })
  
  return (
    <Page withHeader>
      <Head>
        <link 
          rel="alternate" 
          type="application/rss+xml" 
          title="RSS Feed for Overthought" 
          href="/overthought/rss" />
      </Head>
      <NextSeo
        title={"Overthought"}
        description={"Overthinking out loud about design, development, and building products."}
        openGraph={{
          url: "https://brianlovin.com/overthought",
          title: "Overthought",
          description: "Overthinking out loud about design, development, and building products.",
          site_name: "Overthought",
        }}
      />
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