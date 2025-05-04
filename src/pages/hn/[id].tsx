import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { PostDetail } from '~/components/HackerNews/PostDetail'
import { PostsList } from '~/components/HackerNews/PostsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { baseUrl } from '~/config/seo'
import { getPostById } from '~/lib/hn'

function HNPostPage({ id, post }) {
  const router = useRouter()

  if (router.isFallback) {
    return <Detail.Loading />
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          name="description"
          content={
            post.content || `${post.comments_count} comments · ${post.domain}`
          }
        />
        <meta property="og:title" content={post.title} />
        <meta property="og:url" content={`${baseUrl}/hn/${post.id}`} />
        <meta
          property="og:description"
          content={
            post.content || `${post.comments_count} comments · ${post.domain}`
          }
        />
        <meta property="og:image" content={routes.hn.seo.image} />
        <meta property="og:image:alt" content={routes.hn.seo.description} />
      </Head>
      <PostDetail id={id} />
    </>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const post = await getPostById(id, true)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      id,
      post,
    },
  }
}

HNPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default HNPostPage
