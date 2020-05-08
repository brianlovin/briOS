import React from 'react'
import Link from 'next/link'
import { getDateObject } from '~/lib/getDateObject'
import {
  H3,
  Subheading,
  LargeSubheading,
  A,
  Rarr,
} from '~/components/Typography'
import { DesignDetailsPost } from '~/types'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import DesignDetailMedia from '~/components/DesignDetailMedia'
import Markdown from '~/components/MarkdownRenderer'
import Picture from '../Picture'
import Grid from '../Grid'

interface Props {
  post: DesignDetailsPost
}

export default function DesignDetailView(props: Props) {
  const { post } = props

  const { month, year, day } = getDateObject(post.createdAt)
  const datestring = `${month} ${day}, ${year}`
  const subheading = `${datestring} · ${post.details.length} details`

  return (
    <Grid
      gap={48}
      columns={'fit-content(640px)'}
      style={{ justifyContent: 'center' }}
    >
      <Grid gap={32}>
        <Picture
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            width: '64px',
            height: '64px',
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
        <H3>More Dissections</H3>
        <LargeSubheading>
          A visual exploration of digital products
        </LargeSubheading>
        <Link href="/design-details" passHref>
          <A>
            See all posts <Rarr />
          </A>
        </Link>
      </Grid>

      <DesignDetailsGrid truncate={true} />
    </Grid>
  )
}
