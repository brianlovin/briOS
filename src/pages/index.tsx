 
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import Page, { SectionHeading, ContentContainer } from '../components/Page';
import { H1, H2, A, Rarr, Subheading } from '../components/Typography'
import OverthoughtGrid from '../components/OverthoughtGrid'
import DesignDetailsGrid from '../components/DesignDetailsGrid';
import DesignDetailsPlayer from '../components/DesignDetailsPlayer';
import { getPosts } from '../data/ghost'
import { BlogPost } from '../types'

interface Props {
  posts?: Array<BlogPost>
}

function Home(props: Props) {
  const initialData = props.posts
  const { data: posts } = useSWR('/api/getPosts', getPosts, { initialData })

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
              <Link href="/overthought">
                <A>
                  <H2>Overthought <Rarr /></H2>
                </A>
              </Link>
              <Subheading>Thinking out loud about design, development, and building products.</Subheading>
            </SectionHeading>
          </ContentContainer>

          <OverthoughtGrid posts={posts} />
        </React.Fragment>
      )}

      <ContentContainer>
        <SectionHeading>
          <Link href="/design-details">
            <A>
              <H2>Design Details <Rarr /></H2>
            </A>
          </Link>
          <Subheading>An exploration of visual and interaction design in well-known apps.</Subheading>
        </SectionHeading>
      </ContentContainer>

      <DesignDetailsGrid />

      <ContentContainer>
        <SectionHeading>
          <A
            href="https://designdetails.fm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <H2>Design Details Podcast</H2>
          </A>
          <Subheading>
            A weekly conversation about design process and culture.
          </Subheading>
          <Subheading>
            <A
              href="https://designdetails.fm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to site <Rarr />
            </A>
          </Subheading>
        </SectionHeading>

      </ContentContainer>
      
      <DesignDetailsPlayer />
    </Page>
  );
}

Home.getInitialProps = async () => {
  const posts = await getPosts();
  return { posts: posts }
}

export default Home