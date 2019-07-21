// @flow
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  Heading,
  Subheading,
} from '../../components/Page';
import OpenSourceGrid from '../../components/OpenSourceGrid';

class OSS extends React.Component<{}> {
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

export default OSS;
