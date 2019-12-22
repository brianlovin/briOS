import * as React from 'react';
import useSWR from 'swr'
import { getFeaturedPosts } from '~/data/ghost'
import Page, { SectionHeading } from '~/components/Page';
import { H1, LargeSubheading } from '~/components/Typography'
import { BlogPost } from '~/types'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe';
import cacheSsrRes from '~/lib/cacheSsr';
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
        <H1>Overthought</H1>
        <LargeSubheading>Overthinking out loud about design, development, and building products.</LargeSubheading>

        <OverthoughtSubscribeBox />

      </SectionHeading>

      <OverthoughtList posts={posts} />
    </Page>
  );
}

Overthought.getInitialProps = async ({ res }) => {
  cacheSsrRes({ res })
  const posts = await getFeaturedPosts();
  return { posts: posts }
}

export default Overthought