// @flow
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  Heading,
  Subheading,
} from '../../components/Page';
import type { GetInitialProps } from '../../types';
import OpenSourceGrid from '../../components/OpenSourceGrid';

class Books extends React.Component<{}> {
  static async getInitialProps({ res }: GetInitialProps) {
    if (res) {
      const cacheAge = 60 * 60 * 24 * 30;
      res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}`);
    }

    return {};
  }

  render() {
    return (
      <Page>
        <Head>
          <title>Brian Lovin · Open Source</title>
          <meta
            content="Brian Lovin · Open Source™"
            name="og:title"
            key="og:title"
          />
          <meta
            content="What I’m working on"
            name="og:description"
            key="og:description"
          />
          <meta
            content="Brian Lovin · Open Source™"
            name="twitter:title"
            key="og:image"
          />
        </Head>

        <SectionHeading>
          <Heading>Open Source</Heading>
          <Subheading>What I’m working on</Subheading>
        </SectionHeading>

        <OpenSourceGrid />
      </Page>
    );
  }
}

export default Books;
