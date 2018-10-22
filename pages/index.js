// @flow
import * as React from "react";
import Page, { SectionHeading, Heading, Subheading } from '../components/Page'
import type { ConfigPodcast, GetInitialProps } from '../types'
import DesignDetailsGrid from '../components/DesignDetailsGrid'
import OpenSourceGrid from '../components/OpenSourceGrid'
import BookGrid from '../components/BookGrid'
import MusicGrid from '../components/MusicGrid'
import DesignDetailsPlayer from '../components/DesignDetailsPlayer'

type Props = {
  podcasts: Array<ConfigPodcast>
}

class Index extends React.Component<Props> {
  static async getInitialProps({ res }: GetInitialProps) {
    if (res) {
      // cache podcasts for a month
      const cacheAge = 60 * 60 * 24 * 30
      res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}`)
    }

    return {}
  }

  render() {
    return (
      <Page>
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

        <BookGrid truncated />

        <SectionHeading>
          <Heading>Music</Heading>
          <Subheading>Albums on repeat</Subheading>
        </SectionHeading>

        <MusicGrid truncated />
      </Page>
    )
  }
}

export default Index;
