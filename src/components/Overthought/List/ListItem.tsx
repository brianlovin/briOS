import * as React from 'react'
import Link from 'next/link'
import { H4, P } from '~/components/Typography'
import { Card, PreviewImage, Content } from './style'
import { BlogPost } from '~/types';

interface Props {
  post: BlogPost
}

export default function OverthoughtListItem({ post }: Props) {

  return (
    <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
      <a>
        <Card>
          {post.feature_image && <PreviewImage loading="lazy" src={post.feature_image} />}
          <Content>
            <H4 style={{ marginTop: 0 }}>{post.title}</H4>
            <P>{post.custom_excerpt || post.excerpt}</P>
          </Content>
        </Card>
      </a>
    </Link>
  )
}