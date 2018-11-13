// @flow
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  Heading,
  Subheading,
} from '../../components/Page';
import type { GetInitialProps } from '../../types';
import MusicGrid from '../../components/MusicGrid';

class Music extends React.Component<{}> {
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
          <title>Brian Lovin · Music</title>
          <meta content="Brian Lovin · Music™" name="og:title" key="og:title" />
          <meta
            content="Albums on repeat"
            name="og:description"
            key="og:description"
          />
          <meta
            content="Brian Lovin · Music™"
            name="twitter:title"
            key="og:image"
          />
        </Head>

        <SectionHeading>
          <Heading>Music</Heading>
          <Subheading>Albums on repeat</Subheading>
        </SectionHeading>

        <MusicGrid truncated={false} />
      </Page>
    );
  }
}

export default Music;
