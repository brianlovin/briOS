import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import { CenteredColumn } from '~/components/Layouts'
import HNPosts from '~/components/HNPosts'
import { HNComment } from '~/components/HNPost/Comment'
import Grid from '~/components/Grid'
import { H3 } from '~/components/Typography'
import Navigation from '~/components/HNPosts/Navigation'
import { getHNPosts } from '~/graphql/services/hn'

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
}

interface Props {
  posts: HNPost[]
}

export default function HNTop(props: Props) {
  const { posts } = props

  return (
    <Page withHeader>
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
        <Grid gap={32}>
          <H3>Hacker News</H3>
          <Navigation active={'top'} />
          <HNPosts posts={posts} />
        </Grid>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const posts = await getHNPosts('top')

  return {
    unstable_revalidate: 60 * 60 * 4,
    props: {
      posts,
    },
  }
}
