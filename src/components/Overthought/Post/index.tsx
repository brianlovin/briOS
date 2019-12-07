 
import * as React from 'react';
import Link from 'next/link';
import { BlogPost } from '~/types';
import { ContentContainer, SectionHeading } from '~/components/Page';
import { H1, Larr, Subheading } from '~/components/Typography'
import { FeaturedImage } from '~/components/Overthought/Preview/style'
import PostShareButtons from '~/components/ShareButtons';
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import Body from './Body'

interface Props {
  post: BlogPost;
};

export default function Post({ post }) {
  return (
    <ContentContainer data-cy="overthought-post">
      
      <SectionHeading>
        <Link href={'/overthought'}>
          <a>
            <Subheading><Larr /> Overthought</Subheading>
          </a>
        </Link>
        
        <div style={{ paddingBottom: '64px' }} />

        {post.feature_image && <FeaturedImage src={`https://overthought.ghost.io${post.og_image}`} />}
        <H1 style={{ marginTop: 0 }}>{post.title}</H1>
        <div style={{ padding: '8px '}} />
      </SectionHeading>
      
      <Body post={post} />


      <SectionHeading>
        <PostShareButtons route={`overthought/${post.slug}`} title={post.title} />
        <OverthoughtSubscribeBox />
      </SectionHeading>

    </ContentContainer>
  )
}