import React from 'react';
import Link from 'next/link'
import { getDateObject } from '~/lib/getDateObject';
import { ContentContainer, SectionHeading, } from '~/components/Page';
import { H1, H2, Subheading, A, Rarr } from '~/components/Typography'
import { DesignDetailsPost } from '~/types';
import DesignDetailsGrid from '~/components/DesignDetailsGrid';
import DesignDetailMedia from '~/components/DesignDetailMedia';
import PostShareButtons from '~/components/ShareButtons';
import Markdown from '~/components/MarkdownRenderer';
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import {
  HeadingContainer,
  Icon,
  LinkOverrides,
} from './style';

type Props = {
  post: DesignDetailsPost,
};

export default function DesignDetailView(props: Props) {
  const { post } = props;

  const { month, year, day } = getDateObject(post.createdAt);
  const datestring = `${month} ${day}, ${year}`;
  const subheading = `${datestring} · ${post.details.length} details`;

  return (
    <React.Fragment>
      <LinkOverrides tint={post.tint} />
      <ContentContainer style={{ marginTop: '96px' }}>
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

        {post.details.map((detail, i) => (
          <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
        ))}

        <SectionHeading>
          <PostShareButtons route={`design-details/${post.slug}`} title={post.title} />
        </SectionHeading>

        <SectionHeading>
          <H2>More Design Details</H2>
          <Subheading>A visual exploration of digital products</Subheading>
          <Subheading style={{ marginTop: '24px'}}>
            <Link href="/design-details">
              <A>View all posts <Rarr /></A>
            </Link>
          </Subheading>
        </SectionHeading>

      </ContentContainer>


      <DesignDetailsGrid truncate={true} />
    </React.Fragment>
  );
}
