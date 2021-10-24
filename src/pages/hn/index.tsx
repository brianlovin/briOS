import { NextSeo } from 'next-seo'
import * as React from 'react'

import { HNComment } from '~/components/HackerNews/PostComment'
import { PostsList } from '~/components/HackerNews/PostsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { getHNPosts } from '~/lib/hn'

export interface HNPost {
  id: string
  title: string
  user: string
  time: number
  time_ago: string
  comments: HNComment[]
  comments_count: string
  url: string
  domain: string
  content: string
}

interface Props {
  posts: HNPost[]
}

function HNPage() {
  return (
    <NextSeo
      title={routes.hn.seo.title}
      description={routes.hn.seo.description}
      openGraph={routes.hn.seo.openGraph}
    />
  )
}

export async function getStaticProps() {
  const posts = await getHNPosts('top')

  return {
    revalidate: 60 * 60 * 4,
    props: {
      posts,
    },
  }
}

HNPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<PostsList posts={page.props.posts} />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export default HNPage
