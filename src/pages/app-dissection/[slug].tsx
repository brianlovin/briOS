import * as React from 'react'
import { NextSeo } from 'next-seo'
import designDetailsPosts from '~/data/appDissections'
import { DesignDetailsPost } from '~/data/appDissections'
import { useRouter } from 'next/router'
import removeMd from 'remove-markdown'
import { baseUrl } from '~/config/seo'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { AppDissectionList } from '~/components/AppDissection/AppDissectionList'
import { AppDissectionDetail } from '~/components/AppDissection/AppDissectionDetail'
import { withProviders } from '~/components/Providers/withProviders'

interface Props {
  post: DesignDetailsPost
}

function AppDissectionPage({ post }: Props) {
  const router = useRouter()

  React.useEffect(() => {
    // handle bad slug
    if (!post) {
      router.push('/app-dissection')
    }
  }, [])

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
                url: `${baseUrl}/static/meta/app-dissection.png`,
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
      post: designDetailsPosts.find((post) => post.slug === slug),
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
