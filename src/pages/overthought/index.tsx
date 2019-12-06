 
import * as React from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Page, { SectionHeading, ContentContainer } from '../../components/Page';
import OverthoughtGrid from '../../components/OverthoughtGrid'
import { H1, Larr, Subheading } from '../../components/Typography'
import { getPosts } from '../../data/ghost'
import { BlogPost } from '../../types'
import OverthoughtSubscribeBox from '../../components/OverthoughtSubscribeBox';

interface Props {
  posts?: Array<BlogPost>
}

function Overthought({ posts }: Props) {
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
        additionalMetaTags={[
          {
            property: 'dc:creator',
            content: 'Jane Doe'
          }, {
            name: 'application-name',
            content: 'NextSeo'
          }
        ]}
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

Overthought.getInitialProps = async () => {
  const posts = await getPosts();
  return { posts: posts }
}

export default Overthought