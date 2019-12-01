 
import * as React from 'react';
import Link from 'next/link';
import Page, { SectionHeading, LargeHeading, Heading, Subheading, ContentContainer } from '../components/Page';
import DesignDetailsGrid from '../components/DesignDetailsGrid';
import DesignDetailsPlayer from '../components/DesignDetailsPlayer';

export default function Index() {
  return (
    <Page>
      <ContentContainer>
        <SectionHeading style={{ marginTop: '48px'}}>
          <LargeHeading>Brian Lovin</LargeHeading>
          <Subheading style={{ marginTop: '24px' }}>I'm a product designer living in New York City, currently building native mobile apps at GitHub.</Subheading>
          <Subheading><Link href="/about">More about me</Link> &rarr;</Subheading>
        </SectionHeading>
      </ContentContainer>


      <ContentContainer>
        <SectionHeading>
          <Link href="/design-details">
            <a>
              <Heading>Design Details</Heading>
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
          >Go to site</a> &rarr;</Subheading>
        </SectionHeading>

        <DesignDetailsPlayer />
      </ContentContainer>
    </Page>
  );
}
