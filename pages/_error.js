// @flow
import * as React from "react";
import Head from 'next/head'
import Page, { SectionHeading, Heading, Subheading } from '../components/Page'
import type { GetInitialProps } from '../types'
import DesignDetailsGrid from '../components/DesignDetailsGrid'
import OpenSourceGrid from '../components/OpenSourceGrid'
import BooksGrid from '../components/BooksGrid'
import MusicGrid from '../components/MusicGrid'
import DesignDetailsPlayer from '../components/DesignDetailsPlayer'

class Books extends React.Component<{}> {
  static async getInitialProps({ res }: GetInitialProps) {
    if (res) {
      const cacheAge = 60 * 60 * 24 * 30
      res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}`)
    }

    return {}
  }

  render() {
    return (
      <Page>
        <Head>
          <title>Brian Lovin · Nice Boy™</title>
          <meta content={"Brian Lovin · Nice Boy™™"} name="og:title" key="og:title" />
          <meta content={"Nicest not the iciest"} name="og:description" key="og:description" />
          <meta content={"Brian Lovin · Nice Boy™™"} name="twitter:title" key="og:image" />
        </Head>

        <p>We couldn’t find this page</p>

        <SectionHeading>
          <Heading>Design Details Blog</Heading>
          <Subheading>A visual exploration of digital products</Subheading>
        </SectionHeading>

        <DesignDetailsGrid truncated />

        <SectionHeading>
          <Heading>Design Details Podcast</Heading>
          <Subheading>A weekly conversation about design process and culture</Subheading>
        </SectionHeading>

        <DesignDetailsPlayer />

        <SectionHeading>
          <Heading>Open Source</Heading>
          <Subheading>What I’m working on</Subheading>
        </SectionHeading>

        <OpenSourceGrid />

        <SectionHeading>
          <Heading>Books</Heading>
          <Subheading>What I’m reading</Subheading>
        </SectionHeading>

        <BooksGrid truncated />

        <SectionHeading>
          <Heading>Music</Heading>
          <Subheading>Albums on repeat</Subheading>
        </SectionHeading>

        <MusicGrid truncated />
      </Page>
    )
  }
}

export default Books;
