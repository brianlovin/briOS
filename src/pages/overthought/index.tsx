import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import { getFeaturedPosts } from '~/data/ghost'
import Page, { SectionHeading } from '~/components/Page';
import OverthoughtGrid from '~/components/Overthought/Grid'
import { H1, Larr, Subheading } from '~/components/Typography'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import cacheSsrRes from '~/lib/cacheSsr';
import SEO from '~/components/Providers/SEO';

interface Props {
  posts?: Array<BlogPost>
}

function Overthought(props: Props) {
  const initialData = props.posts
  const { data: posts } = useSWR('/api/getFeaturedPosts', getFeaturedPosts, { initialData })
  
  return (
    <Page withHeader>
      <SEO />

      <SectionHeading data-cy="overthought">
        
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

      <OverthoughtGrid truncate={false} posts={posts} />
    </Page>
  );
}

Overthought.getInitialProps = async ({ res }) => {
  cacheSsrRes({ res })
  const posts = await getFeaturedPosts();
  return { posts: posts }
}

export default Overthought