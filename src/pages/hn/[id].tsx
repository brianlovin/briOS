import * as React from 'react'
import { NextSeo } from 'next-seo'
import { HNPost } from '~/components/HNPost'
import HNPosts from '~/components/HNPosts'
import { useRouter } from 'next/router'
import FullscreenLoading from '~/components/FullscreenLoading'
import { getPostById, getPostIds } from '~/graphql/services/hn'
import { HNPost as HNPostType } from '.'
import { baseUrl } from '~/config/seo'
import { getHNPosts } from '~/graphql/services/hn'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'

interface Props {
  post: HNPostType
  posts: HNPostType[]
}

function HNPostPage(props: Props) {
  const { post } = props

  const router = useRouter()

  if (router.isFallback) {
    return <FullscreenLoading />
  }

  return (
    <>
      <NextSeo
        title={'Hacker News'}
        description={'My personal Hacker News reader.'}
        openGraph={{
          title: 'Hacker News',
          description: 'My personal Hacker News reader.',
          images: [
            {
              url: `${baseUrl}/static/meta/hn.png`,
              alt: 'Hacker News',
            },
          ],
        }}
      />

      <HNPost post={post} />
    </>
  )
}

export async function getStaticPaths() {
  const topPostIds = await getPostIds('top')

  const postIds = topPostIds.slice(0, 16)

  const paths = postIds.map((id) => ({
    params: { id: id.toString() },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { id } }) {
  const post = await getPostById(id, true)
  const posts = await getHNPosts('top')

  return {
    revalidate: 60 * 60,
    props: {
      post,
      posts,
    },
  }
}

HNPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<HNPosts posts={page.props.posts} />}
        hasDetail
        detail={page}
      />
    </SiteLayout>
  )
})

export default HNPostPage
