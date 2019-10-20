 
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  Heading,
  Subheading,
} from '../../components/Page';
import DesignDetailsGrid from '../../components/DesignDetailsGrid';

export default function DesignDetails() {
  return (
    <Page>
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

      <SectionHeading>
        <Heading>Design Details</Heading>
        <Subheading>A visual exploration of digital products</Subheading>
      </SectionHeading>

      <DesignDetailsGrid truncated={false} />
    </Page>
  );
}
