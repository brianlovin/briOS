import React from 'react';
import Head from 'next/head';
import { getDateObject } from '../../lib/getDateObject';
import { ContentContainer, SectionHeading, } from '../Page';
import { H1, H2, Subheading } from '../Typography'
import { Notice } from '../Blog';
import { DesignDetailsPost } from '../../types';
import DesignDetailsGrid from '../DesignDetailsGrid';
import DesignDetailMedia from '../DesignDetailMedia';
import PostShareButtons from '../PostShareButtons';
import Markdown from '../Markdown';
import {
  HeadingContainer,
  Icon,
  LinkOverrides,
} from './style';
import DesignDetailsPlayer from '../DesignDetailsPlayer';

type Props = {
  post: DesignDetailsPost,
};

export default function DesignDetailView(props: Props) {
  const { post } = props;

  const { month, year, day } = getDateObject(post.createdAt);
  const datestring = `${month} ${day}, ${year}`;
  const title = `Brian Lovin · Design Details · ${post.title}`;
  const subheading = `${datestring} · ${post.details.length} details`;

  return (
    <React.Fragment>
      <LinkOverrides tint={post.tint} />
      <ContentContainer style={{ marginTop: '96px'}}>
        <Head>
          <title>{title}</title>
          <meta content={title} name="og:title" key="og:title" />
          <meta
            content={post.description}
            name="og:description"
            key="og:description"
          />
          <meta
            content={`/static/img/design-details/${post.slug}.jpeg`}
            name="og:image"
            key="og:image"
          />
          <meta
            content={`Brian Lovin · Design Details · ${post.title}`}
            name="twitter:title"
            key="og:image"
          />
        </Head>

        <Icon
          src={`/static/img/design-details/${post.slug}.jpeg`}
          alt={post.title}
        />

        <HeadingContainer style={{ marginTop: '0' }}>
          <H1>{post.title}</H1>
          <Subheading>{subheading}</Subheading>
        </HeadingContainer>

        <div style={{ padding: '16px' }} />

        <PostShareButtons route={`design-details/${post.slug}`} title={`Design Details: ${post.title}`} />

        <div style={{ padding: '16px' }} />

        <Markdown>{post.description}</Markdown>

        <Notice>
          <Notice.Title>Listen while you read</Notice.Title>
          <Notice.Description>
            Design Details is also a weekly podcast about design
            process and culture. Listen to the latest episode while you read, or
            subscribe in your favorite app.
          </Notice.Description>

          <DesignDetailsPlayer />
        </Notice>

        <div style={{ padding: '16px' }} />

        {post.details.map((detail, i) => (
          <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
        ))}

        <SectionHeading>
          <H2>All Design Details Posts</H2>
          <Subheading>A visual exploration of digital products</Subheading>
        </SectionHeading>

      </ContentContainer>


      <DesignDetailsGrid />
    </React.Fragment>
  );
}
