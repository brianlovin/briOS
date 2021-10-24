import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import * as React from 'react'

import { HNPost } from '~/components/HNPost'
import HNPosts from '~/components/HNPosts'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { getHNPosts, getPostById, getPostIds } from '~/lib/hn'

import { HNPost as HNPostType } from '.'

interface Props {
  post: HNPostType
  posts: HNPostType[]
}

function HNPostPage(props: Props) {
  const { post } = props

  const router = useRouter()

  if (router.isFallback) {
    return <Detail.Loading />
  }

  return (
    <>
      <NextSeo
        title={routes.hn.seo.title}
        description={routes.hn.seo.description}
        openGraph={routes.hn.seo.openGraph}
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
