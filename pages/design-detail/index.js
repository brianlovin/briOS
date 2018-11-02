// @flow
import * as React from "react";
import { api } from '../../config'
import Page, { SectionHeading, Heading, Subheading } from '../../components/Page'
import type { GetInitialProps, DesignDetailsPost } from '../../types'
import DesignDetailView from '../../components/DesignDetailView'
import DesignDetailsGrid from '../../components/DesignDetailsGrid'

type Props = {
  post: ?DesignDetailsPost
}

class DesignDetail extends React.Component<Props> {
  static async getInitialProps({ query, res }: GetInitialProps) {
    if (res) {
      const cacheAge = 60 * 60
      res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}`)
    }

    const post = api.getDesignDetailsFromSlug(query.slug)
    return { post }
  }

  render() {
    const { post } = this.props

    if (post) {
      return (
        <Page>
          <DesignDetailView post={post} />
        </Page>
      )
    } 

    // bad slug
    return (
      <Page>
        <SectionHeading>
          <Heading>Design Details</Heading>
          <Subheading>A visual exploration of digital products</Subheading>
        </SectionHeading>

        <DesignDetailsGrid truncated={false} />
      </Page>
    )
  }
}

export default DesignDetail;
