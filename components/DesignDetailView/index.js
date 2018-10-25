// @flow
import * as React from "react";
import Head from 'next/head'
import { SectionHeading, Heading, Subheading } from '../Page'
import type { DesignDetailsPost } from '../../types'
import DesignDetailsGrid from "../DesignDetailsGrid";
import PostShareButtons from '../PostShareButtons'

type Props = {
  post: DesignDetailsPost
}

class DesignDetails extends React.Component<Props> {
  render() {
    const { post } = this.props

    return (
      <div style={{width:'100%'}}>
        <Head>
          <title>Brian Lovin · Design Details · {post.title}</title>
          <meta content={`Brian Lovin · Design Details · ${post.title}`} name="og:title" key="og:title" />
          <meta content={"A visual exploration of digital products"} name="og:description" key="og:description" />
          <meta content="/static/img/podcasts/design-details.jpg" name="og:image" key="og:image" />
          <meta content={`Brian Lovin · Design Details · ${post.title}`} name="twitter:title" key="og:image" />
        </Head>

        <SectionHeading>
          <Heading>{post.title}</Heading>
          <Subheading>{post.details.length} details</Subheading>
        </SectionHeading>

        <PostShareButtons post={post} />

        <SectionHeading>
          <Heading>More Design Details</Heading>
        </SectionHeading>

        <DesignDetailsGrid truncated={false} />
      </div>
    )
  }
}

export default DesignDetails;
