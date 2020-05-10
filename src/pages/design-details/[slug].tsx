import * as React from 'react'
import { NextSeo } from 'next-seo'
import Page from '~/components/Page'
import designDetailsPosts from '~/data/appDissections'
import DesignDetailView from '~/components/DesignDetailView'
import { DesignDetail as PostType } from '~/components/DesignDetailMedia'
import { useRouter } from 'next/router'

export interface DesignDetailsPost {
  slug: string
  title: string
  description: string
  createdAt: string
  details: Array<PostType>
  tint: string
}

export interface DesignDetailsPostSummary {
  slug: string
  title: string
  tint: string
  firstDetail: PostType
  detailsCount: number
}

interface Props {
  post: DesignDetailsPost
}

export default function DesignDetail({ post }: Props) {
  const router = useRouter()

  React.useEffect(() => {
    // handle bad slug
    if (!post) {
      router.push('/design-details')
    }
  }, [])

  if (post) {
    return (
      <Page withHeader>
        <NextSeo
          title={`${post.title} · App Dissection`}
          description={post.description}
          openGraph={{
            url: `https://brianlovin.com/design-details/${post.slug}`,
            title: post.title,
            description: post.description,
            site_name: 'App Dissection',
          }}
        />
        <DesignDetailView post={post} />
      </Page>
    )
  }

  return null
}

export async function getStaticPaths() {
  const paths = designDetailsPosts.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      post: designDetailsPosts.find((post) => post.slug === slug),
    },
  }
}
