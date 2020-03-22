import * as React from 'react';
import Page, { SectionHeading } from '~/components/Page';
import { H3, LargeSubheading } from '~/components/Typography'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import SEO from '~/components/Overthought/SEO';
import OverthoughtList from '~/components/Overthought/List';
import { POSTS } from '~/api/queries';
import { fetcher } from '~/api';

interface Props {
  posts?: Array<BlogPost>
}

function Overthought({ posts }: Props) {
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
  const { posts } = await fetcher(POSTS);
  return { props: { posts }}
}

export default Overthought