import * as React from 'react';
import useSWR from 'swr'
import { getFeaturedPosts } from '~/data/ghost'
import Page, { SectionHeading } from '~/components/Page';
import { H3, LargeSubheading } from '~/components/Typography'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import SEO from '~/components/Overthought/SEO';
import OverthoughtList from '~/components/Overthought/List';

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
        <H3>Overthought</H3>
        <LargeSubheading>Overthinking out loud about design, development, and building products.</LargeSubheading>

        <OverthoughtList truncated={false} posts={posts} />
        
        <OverthoughtSubscribeBox />

      </SectionHeading>
    </Page>
  );
}

export async function getStaticProps() {
  const posts = await getFeaturedPosts();
  return { props: { posts }}
}

export default Overthought