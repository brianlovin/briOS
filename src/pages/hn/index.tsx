import * as React from 'react'
import { NextSeo } from 'next-seo'
import HNPosts from '~/components/HNPosts'
import { HNComment } from '~/components/HNPost/Comment'
import { getHNPosts } from '~/graphql/services/hn'
import routes from '~/config/routes'
import { ListDetailView } from '~/components/Layouts'

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

export default function HNTop(props: Props) {
  const { posts } = props

  return (
    <>
      <NextSeo
        title={routes.hn.seo.title}
        description={routes.hn.seo.description}
        openGraph={routes.hn.seo.openGraph}
      />

      <ListDetailView detail={null} list={<HNPosts posts={posts} />} />
    </>
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
