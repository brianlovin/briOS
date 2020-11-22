import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import { CenteredColumn } from '~/components/Layouts'
import HNPosts from '~/components/HNPosts'
import { HNComment } from '~/components/HNPost/Comment'
import Navigation from '~/components/HNPosts/Navigation'
import { getHNPosts } from '~/graphql/services/hn'
import HNSubscribeBox from '~/components/HNSubscribe'

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
    <Page>
      <NextSeo
        title={'Hacker News · Top'}
        description={'My personal Hacker News reader.'}
        openGraph={{
          url: 'https://brianlovin.com/hn',
          title: 'Hacker News · Top',
          description: 'My personal Hacker News reader.',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/hn.png',
              alt: 'Hacker News',
            },
          ],
        }}
      />

      <CenteredColumn data-cy="hn">
        <div className="flex flex-col space-y-8">
          <h3>Hacker News</h3>
          <Navigation active={'top'} />
          <HNPosts posts={posts} />
          <HNSubscribeBox />
        </div>
      </CenteredColumn>
    </Page>
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
