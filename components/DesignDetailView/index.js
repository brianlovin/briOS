// @flow
import * as React from "react";
import Head from 'next/head'
import { designDetails } from '../../config'
import { getDateObject } from '../../lib/getDateObject'
import { SectionHeading, Heading, LargeHeading, LargeSubheading } from '../Page'
import { Divider, Notice } from '../Blog'
import { Link as RouteLink } from '../../config/routes'
import type { DesignDetailsPost } from '../../types'
import DesignDetailsGrid from "../DesignDetailsGrid";
import PostShareButtons from '../PostShareButtons'
import Markdown from '../Markdown'
import AtvImage from '../AtvImage'
import { 
  Container, 
  HeadingContainer,
  DetailContainer, 
  DetailTitle, 
  MediaContainer, 
  Video, 
  IconWrapper,
  IconContainer, 
  Icon,
  LeftShadow,
  RightShadow,
  LowOpacity
} from './style'
import DesignDetailsPlayer from "../DesignDetailsPlayer";
import { ATVScript } from "../../lib/atvimg/script";

type Props = {
  post: DesignDetailsPost
}

class DesignDetailsView extends React.Component<Props> {
  iconContainerRef = React.createRef()

  componentDidUpdate(prev: Props) {
    const curr = this.props
    if (prev.post.slug !== curr.post.slug) {
      if (this.iconContainerRef) {
        // $FlowIssue
        return this.iconContainerRef.current.scrollLeft = 0
      }
    }
  }

  render() {
    const { post } = this.props
    const { month, year, day } = getDateObject(post.createdAt)
    const datestring = `${month} ${day}, ${year}`
    const otherPosts = designDetails.filter(p => p.slug !== post.slug)
    const src = `/static/img/design-details/${post.slug}.jpeg`
    
    return (
      <Container>
        <Head>
          <title>Brian Lovin · Design Details · {post.title}</title>
          <meta content={`Brian Lovin · Design Details · ${post.title}`} name="og:title" key="og:title" />
          <meta content={post.description} name="og:description" key="og:description" />
          <meta content={`/static/img/design-details/${post.slug}.jpeg`} name="og:image" key="og:image" />
          <meta content={`Brian Lovin · Design Details · ${post.title}`} name="twitter:title" key="og:image" />
        </Head>

        <IconWrapper>
          <LeftShadow />

          <IconContainer ref={this.iconContainerRef}>
            {
              [post, ...otherPosts].map((p, i) => {
                if (p.slug === post.slug) {
                  return (
                    <RouteLink key={p.slug} route={'design-detail'} params={{ slug: p.slug }}>
                      <a>
                        <AtvImage src={`/static/img/design-details/${p.slug}.jpeg`} Component={Icon} />
                      </a>
                    </RouteLink>
                  )
                }

                return (
                  <LowOpacity key={p.slug}>
                    <RouteLink route={'design-detail'} params={{ slug: p.slug }}>
                      <a>
                        <AtvImage src={`/static/img/design-details/${p.slug}.jpeg`} Component={Icon} />
                      </a>
                    </RouteLink>
                  </LowOpacity>
                )
              })
            }
          </IconContainer>

          <RightShadow />
        </IconWrapper>

        <HeadingContainer>
          <LargeHeading>{post.title}</LargeHeading>
          <LargeSubheading>{datestring} · {post.details.length} details</LargeSubheading>
        </HeadingContainer>

        <div style={{ padding: '16px'}} />

        <PostShareButtons post={post} />

        <div style={{ padding: '16px'}} />

        <Markdown>
          {post.description}
        </Markdown>

        <Notice>
          <Notice.Title>Listen while you read</Notice.Title>
          <Notice.Description>Design Details is also a podcast, a weekly conversation about design process and culture. Listen to the latest episode while you read, or subscribe in your favorite app.</Notice.Description>

          <DesignDetailsPlayer />
        </Notice>

        {
          post.details.map((detail, i) => {
            return (
              <DetailContainer key={`${detail.title}-${i}`}>
                <DetailTitle>{detail.title}</DetailTitle>
                <Markdown>{detail.description}</Markdown>

                <MediaContainer>
                  {
                    detail.media.map(src => (
                      <Video key={src} controls>
                        <source src={src} />
                      </Video>
                    ))
                  }
                </MediaContainer>
              </DetailContainer>
            )
          })
        }

        <PostShareButtons post={post} />

        <Divider />

        <Notice>
          <Notice.Title>Design Details Podcast</Notice.Title>
          <Notice.Description>Design Details is also a podcast, a weekly conversation about design process and culture. Listen to the latest episode while you explore more posts, or subscribe in your favorite app.</Notice.Description>

          <DesignDetailsPlayer />
        </Notice>

        <DesignDetailsGrid truncated={false} />
      </Container>
    )
  }
}

export default DesignDetailsView;
