 
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import Page, { SectionHeading } from '~/components/Page';
import { H1, H2, A, Rarr, Subheading } from '~/components/Typography'
import OverthoughtGrid from '~/components/Overthought/Grid'
import DesignDetailsGrid from '~/components/DesignDetailsGrid';
import DesignDetailsPlayer from '~/components/DesignDetailsPlayer';
import { getFeaturedPosts } from '~/data/ghost'
import { BlogPost } from '~/types'
import cacheSsrRes from '~/lib/cacheSsr';

interface Props {
  posts?: Array<BlogPost>
}

function Home(props: Props) {
  const initialData = props.posts
  const { data: posts } = useSWR('/api/getFeaturedPosts', getFeaturedPosts, { initialData })

  return (
    <Page>
      <SectionHeading>
        <H1>Brian Lovin</H1>
        <Subheading>I'm a product designer, podcaster, and writer, living in New York City. I'm currently building native mobile apps at GitHub.</Subheading>
        <Subheading><Link href="/about"><A>More about me <Rarr /></A></Link></Subheading>
      </SectionHeading>

      {posts && posts.length > 0 && (
        <React.Fragment>
          <SectionHeading data-cy="overthought">
            <H2>Overthought</H2>
            <Subheading>Thinking out loud about design, development, and building products.</Subheading>
            <Subheading>
              <Link href="/overthought">
                <A>View all posts <Rarr /></A>
              </Link>
            </Subheading>
          </SectionHeading>

          <OverthoughtGrid truncate={true} posts={posts} />
        </React.Fragment>
      )}

      <SectionHeading>
        <H2>Design Details Podcast</H2>
        <Subheading>
          A weekly conversation about design process and culture.
        </Subheading>
        <Subheading>
          <A href="https://designdetails.fm" target="_blank" rel="noopener noreferrer">Go to site <Rarr /></A>
        </Subheading>
      </SectionHeading>
      
      <DesignDetailsPlayer showMoreEpisodes />

      <SectionHeading>
        <H2>App Dissection</H2>
        <Subheading>An in-depth exploration of visual and interaction design in well-known apps.</Subheading>
        <Subheading>
          <Link href="/design-details">
            <A>View all posts <Rarr /></A>
          </Link>
        </Subheading>
      </SectionHeading>

      <DesignDetailsGrid truncate={true} />
    </Page>
  );
}

Home.getInitialProps = async ({ res }) => {
  cacheSsrRes({ res })
  const posts = await getFeaturedPosts();
  return { posts: posts }
}

export default Home