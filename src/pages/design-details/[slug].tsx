import * as React from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import Page, { SectionHeading } from '~/components/Page'
import { H1, Subheading } from '~/components/Typography'
import designDetailsPosts from '~/data/appDissections'
import DesignDetailView from '~/components/DesignDetailView'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import { DesignDetail as PostType } from '~/components/DesignDetailMedia'

export interface DesignDetailsPost {
  slug: string
  title: string
  description: string
  createdAt: string
  details: Array<PostType>
  tint: string
}

interface Props {
  post: DesignDetailsPost
}

export default function DesignDetail() {
  const router = useRouter()
  const { slug } = router.query
  const post = designDetailsPosts.find((post) => post.slug === slug)

  if (post) {
    return (
      <Page withHeader>
        <NextSeo
          title={`Design Details · ${post.title}`}
          description={post.description}
          openGraph={{
            url: `https://brianlovin.com/design-details/${post.slug}`,
            title: post.title,
            description: post.description,
            site_name: 'Design Details',
          }}
        />
        <DesignDetailView post={post} />
      </Page>
    )
  }

  // bad slug
  return (
    <Page withHeader>
      <SectionHeading>
        <H1>Design Details</H1>
        <Subheading>A visual exploration of digital products</Subheading>
      </SectionHeading>

      <DesignDetailsGrid truncate={false} />
    </Page>
  )
}
