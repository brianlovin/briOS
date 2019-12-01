import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getDateObject } from '../../lib/getDateObject';
import { LargeHeading, LargeSubheading, ContentContainer } from '../Page';
import { Notice } from '../Blog';
import { DesignDetailsPost } from '../../types';
import DesignDetailsGrid from '../DesignDetailsGrid';
import DesignDetailMedia from '../DesignDetailMedia';
import PostShareButtons from '../PostShareButtons';
import Markdown from '../Markdown';
import {
  HeadingContainer,
  Icon,
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

        <HeadingContainer>
          <LargeHeading>{post.title}</LargeHeading>
          <LargeSubheading>{subheading}</LargeSubheading>
        </HeadingContainer>

        <div style={{ padding: '16px' }} />

        <PostShareButtons post={post} />

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

        </ContentContainer>
      <DesignDetailsGrid />
    </React.Fragment>
  );
}
