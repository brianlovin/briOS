import * as React from 'react';
import Page, { SectionHeading } from '~/components/Page';
import { H3, LargeSubheading } from '~/components/Typography'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import SEO from '~/components/Overthought/SEO';
import OverthoughtList from '~/components/Overthought/List';
import { POSTS } from '~/api/queries';
import { fetcher, swr } from '~/api';

interface Props {
  data: {
    posts?: Array<BlogPost>
  }
}

function Overthought(props: Props) {
  const { data, error } = swr({ query: POSTS, initialData: props.data })

  if (error) return null

  if (!data) return null

  return (
    <Page withHeader>
      <SEO />

      <SectionHeading data-cy="overthought">
        <H3>Overthought</H3>
        <LargeSubheading>Overthinking out loud about design, development, and building products.</LargeSubheading>

        <OverthoughtList truncated={false} posts={data.posts} />
        
        <OverthoughtSubscribeBox />

      </SectionHeading>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await fetcher(POSTS);
  return { props: { data }}
}

export default Overthought