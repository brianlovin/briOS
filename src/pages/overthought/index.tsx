import * as React from 'react';
import Page, { SectionHeading } from '~/components/Page';
import { H3, LargeSubheading } from '~/components/Typography'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import SEO from '~/components/Overthought/SEO';
import OverthoughtList from '~/components/Overthought/List';
import { POSTS } from '~/api/queries';
import { fetcher } from '~/api';
import useSWR, { mutate } from 'swr';

interface Props {
  data: {
    posts: BlogPost[]
  }
}

function Overthought(props: Props) {
  const { data, error } = useSWR(POSTS, query => fetcher({ query }), { initialData: props.data })

  React.useEffect(() => {
    mutate(POSTS)
  }, [])

  if (error) return null

  return (
    <Page withHeader>
      <SEO />

      <SectionHeading data-cy="overthought">
        <H3>Overthought</H3>
        <LargeSubheading>Overthinking out loud about design, development, and building products.</LargeSubheading>

        { data && data.posts && <OverthoughtList posts={data.posts} /> }
        
        <OverthoughtSubscribeBox />

      </SectionHeading>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await fetcher({ query: POSTS });
  return { props: { data }}
}

export default Overthought