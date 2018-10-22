// @flow
import * as React from "react";
import Head from 'next/head'
import Page, { SectionHeading, Heading, Subheading } from '../../components/Page'
import type { GetInitialProps } from '../../types'
import DesignDetailsGrid from "../../components/DesignDetailsGrid";


class DesignDetails extends React.Component<{}> {
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
          <meta content={"Brian Lovin · Design Details™"} name="og:title" key="og:title" />
          <meta content={"A visual exploration of digital products"} name="og:description" key="og:description" />
          <meta content="/static/img/podcasts/design-details.jpg" name="og:image" key="og:image" />
          <meta content={"Brian Lovin · Design Details™"} name="twitter:title" key="og:image" />
        </Head>

        <SectionHeading>
          <Heading>Design Details</Heading>
          <Subheading>A visual exploration of digital products</Subheading>
        </SectionHeading>

        <DesignDetailsGrid truncated={false} />
      </Page>
    )
  }
}

export default DesignDetails;
