// @flow
import * as React from 'react';
import Head from 'next/head';
import Page, {
  SectionHeading,
  Heading,
  Subheading,
} from '../../components/Page';

export default function About() {
  return (
    <Page showEmailCapture={false}>
      <Head>
        <title>Brian Lovin · About</title>
        <meta content="Brian Lovin · About" name="og:title" key="og:title" />
        <meta content="Designer" name="og:description" key="og:description" />
        <meta
          content="Brian Lovin · About"
          name="twitter:title"
          key="twitter:title"
        />
      </Head>

      <SectionHeading>
        <Heading>About me</Heading>

        <div style={{ padding: '8px' }} />

        <Subheading>
          I’m a designer and developer, currently working on{' '}
          <a
            href="https://spectrum.chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spectrum
          </a>
          . Feel free to{' '}
          <a
            href="https://twitter.com/brian_lovin"
            target="_blank"
            rel="noopener noreferrer"
          >
            tweet at me{' '}
          </a>
          or{' '}
          <a
            href="mailto:hi@brianlovin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            get in touch
          </a>
          .
        </Subheading>

        <div style={{ padding: '8px' }} />

        <Subheading>
          The code that powers this website is{' '}
          <a
            href="https://github.com/brianlovin/brian-lovin-next"
            target="_blank"
            rel="noopener noreferrer"
          >
            open source
          </a>
          .
        </Subheading>
      </SectionHeading>
    </Page>
  );
}
