import React from 'react'
import Link from 'next/link'
import { H3, Subheading, A, Rarr } from '~/components/Typography'
import DesignDetailMedia from '~/components/DesignDetailMedia'
import Markdown from '~/components/MarkdownRenderer'
import Picture from '../Picture'
import Grid from '../Grid'
import { format } from 'timeago.js'
import { DesignDetailsPost } from '~/data/appDissections'

interface Props {
  post: DesignDetailsPost
}

export default function DesignDetailView(props: Props) {
  const { post } = props

  const subheading = `Posted ${format(post.createdAt)} · ${
    post.details.length
  } details`

  return (
    <Grid
      gap={48}
      columns={'fit-content(640px)'}
      style={{ justifyContent: 'center' }}
    >
      <Grid gap={32}>
        <Picture
          width={'64px'}
          height={'64px'}
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
          }}
          srcset={[
            `/static/img/design-details/${post.slug}.webp`,
            `/static/img/design-details/${post.slug}.jpeg`,
          ]}
          alt={post.title}
        />
        <Grid gap={16}>
          <H3>{post.title}</H3>
          <Subheading>{subheading}</Subheading>
        </Grid>
        <Markdown>{post.description}</Markdown>
        {post.details.map((detail, i) => (
          <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
        ))}
      </Grid>

      <Grid gap={16}>
        <H3>App Dissection</H3>
        <Link href="/design-details" passHref>
          <A>
            See all posts <Rarr />
          </A>
        </Link>
      </Grid>
    </Grid>
  )
}
