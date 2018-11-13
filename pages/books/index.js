// @flow
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  Heading,
  Subheading,
} from '../../components/Page';
import type { GetInitialProps } from '../../types';
import BooksGrid from '../../components/BooksGrid';

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
          <title>Brian Lovin · Books</title>
          <meta content="Brian Lovin · Books™" name="og:title" key="og:title" />
          <meta
            content="What I’m reading"
            name="og:description"
            key="og:description"
          />
          <meta
            content="Brian Lovin · Books™"
            name="twitter:title"
            key="og:image"
          />
        </Head>

        <SectionHeading>
          <Heading>Books</Heading>
          <Subheading>What I’m reading</Subheading>
        </SectionHeading>

        <BooksGrid truncated={false} />
      </Page>
    );
  }
}

export default Books;
