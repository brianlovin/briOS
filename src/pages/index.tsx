 
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import Page, { SectionHeading, ContentContainer } from '~/components/Page';
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
      <ContentContainer>
        <SectionHeading>
          <H1>Brian Lovin</H1>
          <Subheading>I'm a product designer living in New York City, currently building native mobile apps at GitHub.</Subheading>
          <Subheading><Link href="/about"><A>More about me <Rarr /></A></Link></Subheading>
        </SectionHeading>
      </ContentContainer>

      {posts && posts.length > 0 && (
        <React.Fragment>
          <ContentContainer data-cy="overthought">
            <SectionHeading>
              <H2>Overthought</H2>
              <Subheading>Thinking out loud about design, development, and building products.</Subheading>
              <Subheading style={{ marginTop: '24px'}}>
                <Link href="/overthought">
                  <A>View all posts <Rarr /></A>
                </Link>
              </Subheading>
            </SectionHeading>
          </ContentContainer>

          <OverthoughtGrid truncate={true} posts={posts} />
        </React.Fragment>
      )}

      <ContentContainer>
        <SectionHeading>
          <H2>Design Details</H2>
          <Subheading>An exploration of visual and interaction design in well-known apps.</Subheading>
          <Subheading style={{ marginTop: '24px'}}>
            <Link href="/design-details">
              <A>View all posts <Rarr /></A>
            </Link>
          </Subheading>
        </SectionHeading>
      </ContentContainer>

      <DesignDetailsGrid truncate={true} />

      <ContentContainer>
        <SectionHeading>
          <H2>Design Details Podcast</H2>
          <Subheading>
            A weekly conversation about design process and culture.
          </Subheading>
          <Subheading style={{ marginTop: '24px'}}>
            <A href="https://designdetails.fm" target="_blank" rel="noopener noreferrer">Go to site <Rarr /></A>
          </Subheading>
        </SectionHeading>
      </ContentContainer>
      
      <DesignDetailsPlayer showMoreEpisodes />
    </Page>
  );
}

Home.getInitialProps = async ({ res }) => {
  cacheSsrRes({ res })
  const posts = await getFeaturedPosts();
  return { posts: posts }
}

export default Home