// @flow
import * as React from 'react'
import Head from 'next/head'
import Page, { SectionHeading, Heading, Subheading } from '../../components/Page'
import SpecificsGrid from '../../components/SpecificsGrid'

class Specifics extends React.Component<{}> {
  render() {
    return (
      <Page>
        <Head>
          <title>Spec · Specifics</title>
          <meta content={"Spec · Specifics"} name="og:title" key="og:title" />
          <meta content={"Reference guides for designers and developers"} name="og:description" key="og:description" />
          <meta content="/static/img/specifics/001-header.png" name="og:image" key="og:image" />
          <meta content={"Spec · Specifics"} name="twitter:title" key="twitter:title" />
        </Head>
      
        <SectionHeading>
          <Heading>Specifics</Heading>
          <Subheading>Reference guides for designers and developers</Subheading>
        </SectionHeading>

        <SpecificsGrid />
      </Page>
    )
  }
}

export default Specifics