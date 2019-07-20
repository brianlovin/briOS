// @flow
// $FlowIssue
import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { designDetails } from '../../config';
import { getDateObject } from '../../lib/getDateObject';
import { LargeHeading, LargeSubheading } from '../Page';
import { Divider, Notice } from '../Blog';
import type { DesignDetailsPost } from '../../types';
import DesignDetailsGrid from '../DesignDetailsGrid';
import DesignDetailMedia from '../DesignDetailMedia';
import PostShareButtons from '../PostShareButtons';
import Markdown from '../Markdown';
import AtvImage from '../AtvImage';
import {
  Container,
  HeadingContainer,
  IconWrapper,
  IconContainer,
  Icon,
  LeftShadow,
  RightShadow,
  LowOpacity,
} from './style';
import DesignDetailsPlayer from '../DesignDetailsPlayer';

type Props = {
  post: DesignDetailsPost,
};

export default function DesignDetailView(props: Props) {
  const iconContainerRef = useRef(null);
  const { post } = props;

  useEffect(() => {
    if (iconContainerRef) {
      // $FlowIssue
      iconContainerRef.current.scrollLeft = 0;
    }
  }, [post.slug]);

  const { month, year, day } = getDateObject(post.createdAt);
  const datestring = `${month} ${day}, ${year}`;
  const otherPosts = designDetails.filter(p => p.slug !== post.slug);
  const title = `Brian Lovin · Design Details · ${post.title}`;
  const subheading = `${datestring} · ${post.details.length} details`;

  return (
    <Container>
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

      <IconWrapper>
        <LeftShadow />

        <IconContainer ref={iconContainerRef}>
          {[post, ...otherPosts].map(p => {
            if (p.slug === post.slug) {
              return (
                <Link
                  key={p.slug}
                  href="/design-details/[slug]"
                  as={`/design-details/${p.slug}`}
                >
                  <a name={p.title}>
                    <AtvImage
                      src={`/static/img/design-details/${p.slug}.jpeg`}
                      Component={Icon}
                    />
                  </a>
                </Link>
              );
            }

            return (
              <LowOpacity key={p.slug}>
                <Link href={`/design-details/${p.slug}`}>
                  <a name={p.title}>
                    <AtvImage
                      src={`/static/img/design-details/${p.slug}.jpeg`}
                      Component={Icon}
                    />
                  </a>
                </Link>
              </LowOpacity>
            );
          })}
        </IconContainer>

        <RightShadow />
      </IconWrapper>

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
          Design Details is also a podcast, a weekly conversation about design
          process and culture. Listen to the latest episode while you read, or
          subscribe in your favorite app.
        </Notice.Description>

        <DesignDetailsPlayer />
      </Notice>

      <div style={{ padding: '16px' }} />

      {post.details.map((detail, i) => (
        <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
      ))}

      <PostShareButtons post={post} />

      <Divider />

      <Notice>
        <Notice.Title>Design Details Podcast</Notice.Title>
        <Notice.Description>
          Design Details is also a podcast, a weekly conversation about design
          process and culture. Listen to the latest episode while you explore
          more posts, or subscribe in your favorite app.
        </Notice.Description>

        <DesignDetailsPlayer />
      </Notice>

      <DesignDetailsGrid truncated={false} />
    </Container>
  );
}
