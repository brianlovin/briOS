import React from 'react'
import Link from 'next/link'
import { getDateObject } from '~/lib/getDateObject'
import { ContentContainer, SectionHeading } from '~/components/Page'
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
import { HeadingContainer, Icon } from './style'

interface Props {
  post: DesignDetailsPost
}

export default function DesignDetailView(props: Props) {
  const { post } = props

  const { month, year, day } = getDateObject(post.createdAt)
  const datestring = `${month} ${day}, ${year}`
  const subheading = `${datestring} · ${post.details.length} details`

  return (
    <React.Fragment>
      <ContentContainer>
        <Icon
          src={`/static/img/design-details/${post.slug}.jpeg`}
          alt={post.title}
        />

        <HeadingContainer style={{ marginTop: '0' }}>
          <H3>{post.title}</H3>
          <Subheading>{subheading}</Subheading>
        </HeadingContainer>

        <div style={{ padding: '16px' }} />

        <Markdown>{post.description}</Markdown>

        {post.details.map((detail, i) => (
          <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
        ))}

        <SectionHeading>
          <H3>More Dissections</H3>
          <LargeSubheading>
            A visual exploration of digital products
          </LargeSubheading>
          <Subheading style={{ marginTop: '24px' }}>
            <Link href="/design-details" passHref>
              <A>
                See all posts <Rarr />
              </A>
            </Link>
          </Subheading>
        </SectionHeading>
      </ContentContainer>

      <DesignDetailsGrid truncate={true} />
    </React.Fragment>
  )
}
