 
import * as React from 'react';
import Link from 'next/link';
import Page, { SectionHeading, LargeHeading, Heading, Subheading, ContentContainer, Rarr } from '../components/Page';
import DesignDetailsGrid from '../components/DesignDetailsGrid';
import DesignDetailsPlayer from '../components/DesignDetailsPlayer';
import { getPosts } from '../data/ghost'

interface Props {
  posts?: Array<any>
}

function Home({ posts }: Props) {
  console.log({ posts }) 
  return (
    <Page>
      <ContentContainer>
        <SectionHeading>
          <LargeHeading>Brian Lovin</LargeHeading>
          <Subheading>I'm a product designer living in New York City, currently building native mobile apps at GitHub.</Subheading>
          <Subheading><Link href="/about"><a>More about me <Rarr /></a></Link></Subheading>
        </SectionHeading>
      </ContentContainer>

      <ContentContainer>
        <SectionHeading>
          <Link href="/overthought">
            <a>
              <Heading>Overthought <Rarr /></Heading>
            </a>
          </Link>
          <Subheading>Overthinking out loud about design, development, and building products.</Subheading>
        </SectionHeading>
      </ContentContainer>

      <ContentContainer>
        <SectionHeading>
          <Link href="/design-details">
            <a>
              <Heading>Design Details <Rarr /></Heading>
            </a>
          </Link>
          <Subheading>An exploration of visual and interaction design in well-known apps.</Subheading>
        </SectionHeading>
      </ContentContainer>

      <DesignDetailsGrid />

      <ContentContainer>
        <SectionHeading>
          <a
            href="https://designdetails.fm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Heading>Design Details Podcast</Heading>
          </a>
          <Subheading>
            A weekly conversation about design process and culture.
          </Subheading>
          <Subheading><a
            href="https://designdetails.fm"
            target="_blank"
            rel="noopener noreferrer"
          >Go to site <Rarr /></a></Subheading>
        </SectionHeading>

        <DesignDetailsPlayer />
      </ContentContainer>
    </Page>
  );
}

Home.getInitialProps = async () => {
  const posts = await getPosts();
  return { posts: posts }
}

export default Home