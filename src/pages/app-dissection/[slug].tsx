import { NextSeo } from 'next-seo'
import * as React from 'react'
import removeMd from 'remove-markdown'

import { AppDissectionDetail } from '~/components/AppDissection/AppDissectionDetail'
import { AppDissectionList } from '~/components/AppDissection/AppDissectionList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'
import { baseUrl } from '~/config/seo'
import designDetailsPosts from '~/data/appDissections'
import { DesignDetailsPost } from '~/data/appDissections'

interface Props {
  post: DesignDetailsPost
}

function AppDissectionPage({ post }: Props) {
  if (!post) return <Detail.Null />

  if (post) {
    return (
      <>
        <NextSeo
          title={`${post.title} · App Dissection`}
          description={post.description}
          openGraph={{
            url: `${baseUrl}/app-dissection/${post.slug}`,
            title: post.title,
            description: removeMd(post.description),
            site_name: 'App Dissection',
            images: [
              {
                url: `${baseUrl}/static/og/app-dissection.png`,
                alt: 'App Dissection',
              },
            ],
          }}
        />

        <AppDissectionDetail post={post} />
      </>
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
      post: designDetailsPosts.find((post) => post.slug === slug) || null,
    },
  }
}

AppDissectionPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<AppDissectionList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default AppDissectionPage
