// @flow
import * as React from 'react';
import Page, { SectionHeading, Heading, Subheading } from '../components/Page';
import type { GetInitialProps } from '../types';
import { Link as RouteLink } from '../config/routes';
import DesignDetailsGrid from '../components/DesignDetailsGrid';
import OpenSourceGrid from '../components/OpenSourceGrid';
import BooksGrid from '../components/BooksGrid';
import MusicGrid from '../components/MusicGrid';
import DesignDetailsPlayer from '../components/DesignDetailsPlayer';

class Index extends React.Component<{}> {
  static async getInitialProps({ res }: GetInitialProps) {
    if (res) {
      // cache podcasts for a month
      const cacheAge = 60 * 60 * 24 * 30;
      res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}`);
    }

    return {};
  }

  render() {
    return (
      <Page>
        <SectionHeading>
          <RouteLink route="design-details">
            <a>
              <Heading>Design Details Blog</Heading>
            </a>
          </RouteLink>
          <Subheading>A visual exploration of digital products</Subheading>
        </SectionHeading>

        <DesignDetailsGrid truncated />

        <SectionHeading>
          <a
            href="https://spec.fm/podcasts/design-details"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Heading>Design Details Podcast</Heading>
          </a>
          <Subheading>
            A weekly conversation about design process and culture
          </Subheading>
        </SectionHeading>

        <DesignDetailsPlayer />

        <SectionHeading>
          <RouteLink route="oss">
            <a>
              <Heading>Open Source</Heading>
            </a>
          </RouteLink>
          <Subheading>What I’m working on</Subheading>
        </SectionHeading>

        <OpenSourceGrid />

        <SectionHeading>
          <RouteLink route="books">
            <a>
              <Heading>Books</Heading>
            </a>
          </RouteLink>
          <Subheading>What I’m reading</Subheading>
        </SectionHeading>

        <BooksGrid truncated />

        <SectionHeading>
          <RouteLink route="music">
            <a>
              <Heading>Music</Heading>
            </a>
          </RouteLink>
          <Subheading>Albums on repeat</Subheading>
        </SectionHeading>

        <MusicGrid truncated />
      </Page>
    );
  }
}

export default Index;
