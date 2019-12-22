import * as React from 'react'
import Link from 'next/link'
import { getDateObject } from '~/lib/getDateObject'
import { H5, P } from '~/components/Typography'
import { Card, PreviewImage } from './style'
import { BlogPost } from '~/types';

interface Props {
  post: BlogPost
}

export default function OverthoughtPreviewCard({ post }: Props) {
  return (
    <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
      <a>
        <Card style={{ height: '100%' }}>
          {post.feature_image && <PreviewImage loading="lazy" src={post.feature_image} />}
          <H5 style={{ marginTop: 0 }}>{post.title}</H5>
          <P>{post.custom_excerpt || post.excerpt}</P>
        </Card>
      </a>
    </Link >
  )
}