import * as React from 'react';
import useSWR from 'swr'
import { getFeaturedPosts } from '~/data/ghost'
import Page, { SectionHeading } from '~/components/Page';
import { H4, P } from '~/components/Typography'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import cacheSsrRes from '~/lib/cacheSsr';
import SEO from '~/components/Overthought/SEO';
import OverthoughtList from '~/components/Overthought/List';
import defaultTheme from '~/components/Theme';

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
        <H4 style={{ marginBottom: defaultTheme.space[2] }}>Overthought</H4>
        <P style={{ fontWeight: 500 }}>Overthinking out loud about design, development, and building products.</P>

        <OverthoughtList truncated={false} posts={posts} />
        
        <OverthoughtSubscribeBox />

      </SectionHeading>
    </Page>
  );
}

Overthought.getInitialProps = async ({ res }) => {
  cacheSsrRes({ res })
  const posts = await getFeaturedPosts();
  return { posts: posts }
}

export default Overthought