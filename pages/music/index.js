// @flow
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  Heading,
  Subheading,
} from '../../components/Page';
import MusicGrid from '../../components/MusicGrid';

class Music extends React.Component<{}> {
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
