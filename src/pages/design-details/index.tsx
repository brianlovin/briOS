 
import * as React from 'react';
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Page, { SectionHeading, ContentContainer } from '../../components/Page';
import { H1, Larr, Subheading } from '../../components/Typography'
import DesignDetailsGrid from '../../components/DesignDetailsGrid';

export default function DesignDetails() {
  return (
    <Page withHeader>
      <NextSeo
        title={"Brian Lovin · Design Details"}
        description={"A visual exploration of digital products"}
      />
      
      <ContentContainer>
        <SectionHeading style={{ marginBottom: '32px' }}>
          <Link href="/">
            <a>
              <Subheading><Larr /> Home</Subheading>
            </a>
          </Link>

          <div style={{ padding: '16px' }} />
          
          <H1>Design Details</H1>
          <Subheading style={{ marginTop: '24px' }}>This collection of posts explores some of the best interaction patterns, visual styles, and design decisions of well-known apps. Each detail features a video and my commentary on the functionality and effectiveness of the interface.</Subheading>
        </SectionHeading>
      </ContentContainer>

      <DesignDetailsGrid />
    </Page>
  );
}
