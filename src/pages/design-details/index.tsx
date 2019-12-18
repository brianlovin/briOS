 
import * as React from 'react';
import { NextSeo } from 'next-seo'
import Page, { SectionHeading } from '~/components/Page';
import { H1, Subheading } from '~/components/Typography'
import DesignDetailsGrid from '~/components/DesignDetailsGrid';

export default function DesignDetails() {
  return (
    <Page withHeader>
      <NextSeo
        title={"App Dissection"}
        description={"A visual exploration of digital products"}
        openGraph={{
          url: "https://brianlovin.com/design-details",
          title: "App Dissection",
          description: "A visual exploration of digital products",
          site_name: "App Dissection",
          images: [
            {
              url: 'https://brianlovin.com/static/og-image.jpeg',
              alt: 'App Dissection',
            },
          ],
        }}
      />
      
      <SectionHeading>
        <H1>App Dissection</H1>
        <Subheading style={{ marginTop: '24px' }}>This collection of posts explores some of the best interaction patterns, visual styles, and design decisions of well-known apps. Each detail features a video and my commentary on the functionality and effectiveness of the interface.</Subheading>
      </SectionHeading>

      <DesignDetailsGrid truncate={false} />
    </Page>
  );
}
