
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import Page, { SectionHeading } from '~/components/Page';
import { H1, H3, A, Rarr, Subheading, LargeSubheading } from '~/components/Typography'
import OverthoughtGrid from '~/components/Overthought/Grid'
import DesignDetailsGrid from '~/components/DesignDetailsGrid';
import DesignDetailsPlayer from '~/components/DesignDetailsPlayer';
import FigmaPlugins from '~/components/FigmaPlugins';
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
        <LargeSubheading>I'm a product designer, podcaster, and writer, living in New York City. I'm currently building native mobile apps at GitHub.</LargeSubheading>
        <Subheading><Link href="/about" as="/about"><a>More about me <Rarr /></a></Link></Subheading>
      </SectionHeading>

      {posts && posts.length > 0 && (
        <React.Fragment>
          <SectionHeading data-cy="overthought">
            <H3>Overthought</H3>
            <LargeSubheading>Thinking out loud about design, development, and building products.</LargeSubheading>
            <Subheading>
              <Link href="/overthought" as="/overthought">
                <a>View all posts <Rarr /></a>
              </Link>
            </Subheading>
          </SectionHeading>

          <OverthoughtGrid truncate={true} posts={posts} />
        </React.Fragment>
      )}

      <SectionHeading>
        <H3>Design Details Podcast</H3>
        <LargeSubheading>
          A weekly conversation about design process and culture.
        </LargeSubheading>
        <Subheading>
          <A href="https://designdetails.fm" target="_blank" rel="noopener noreferrer">See all episodes <Rarr /></A>
        </Subheading>
      </SectionHeading>

      <DesignDetailsPlayer showMoreEpisodes />

      <SectionHeading>
        <H3>Figma Plugins</H3>
        <LargeSubheading>
          Plugins I'm using to make product design a tiny bit less tedious.
        </LargeSubheading>
        <Subheading>
          <A href="https://figma.com/@brian" target="_blank" rel="noopener noreferrer">View on Figma <Rarr /></A>
        </Subheading>
      </SectionHeading>

      <FigmaPlugins />

      <SectionHeading>
        <H3>App Dissection</H3>
        <LargeSubheading>An in-depth exploration of visual and interaction design in well-known apps.</LargeSubheading>
        <Subheading>
          <Link href="/design-details">
            <a>View all posts <Rarr /></a>
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