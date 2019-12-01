 
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  LargeHeading,
  Subheading,
  ContentContainer,
} from '../../components/Page';
import DesignDetailsGrid from '../../components/DesignDetailsGrid';

export default function DesignDetails() {
  return (
    <Page withHeader>
      <Head>
        <title>Brian Lovin · Design Details</title>
        <meta
          content="Brian Lovin · Design Details"
          name="og:title"
          key="og:title"
        />
        <meta
          content="A visual exploration of digital products"
          name="og:description"
          key="og:description"
        />
        <meta
          content="/static/img/podcasts/design-details.jpg"
          name="og:image"
          key="og:image"
        />
        <meta
          content="Brian Lovin · Design Details"
          name="twitter:title"
          key="og:image"
        />
      </Head>

      <ContentContainer>
        <SectionHeading>
          <LargeHeading>Design Details</LargeHeading>
          <Subheading style={{ marginTop: '24px' }}>This collection of posts explores some of the best interaction patterns, visual styles, and design decisions of well-known apps. Each detail features a video and my commentary on the functionality and effectiveness of the interface.</Subheading>
        </SectionHeading>
      </ContentContainer>

      <DesignDetailsGrid />
    </Page>
  );
}
