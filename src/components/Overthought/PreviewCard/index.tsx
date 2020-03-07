import * as React from 'react'
import Link from 'next/link'
import { getDateObject } from '~/lib/getDateObject'
import { H5, P, LargeSubheading } from '~/components/Typography'
import { Card, PreviewImage } from './style'
import { BlogPost } from '~/types';

interface Props {
  post: BlogPost
}

export default function OverthoughtPreviewCard({ post }: Props) {
  return (
    <LargeSubheading style={{ marginTop: 0 }}>
      <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
        <a>
          {post.title}
        </a>
      </Link >
    </LargeSubheading>
  )
}