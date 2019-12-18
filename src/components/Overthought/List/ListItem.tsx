import * as React from 'react'
import Link from 'next/link'
import { getDateObject } from '~/lib/getDateObject'
import { H4, P } from '~/components/Typography'
import { Card, PreviewImage, ReadingTime, Content } from './style'
import { BlogPost } from '~/types';

interface Props {
  post: BlogPost
}

export default function OverthoughtListItem({ post }: Props) {
  const { month, year, day } = getDateObject(post.published_at);
  const datestring = `${month.slice(0, 3)} ${day}, ${year}`;

  return (
    <Link href="/overthought/[slug]" as={`/overthought/${post.slug}`}>
      <a>
        <Card>
          {post.feature_image && <PreviewImage loading="lazy" src={post.feature_image} />}
          <Content>
            <H4 style={{ marginTop: 0 }}>{post.title}</H4>
            <P>{post.custom_excerpt || post.excerpt}</P>
            <ReadingTime>{datestring} · {post.reading_time}m read</ReadingTime>
          </Content>
        </Card>
      </a>
    </Link>
  )
}