import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import { CenteredColumn } from '~/components/Layouts'
import HNPosts from '~/components/HNPosts'
import Grid from '~/components/Grid'
import { H3 } from '~/components/Typography'
import Navigation from '~/components/HNPosts/Navigation'
import { getHNPosts } from '~/graphql/services/hn'
import { HNPost } from '.'
import HNSubscribeBox from '~/components/HNSubscribe'

interface Props {
  posts: HNPost[]
}

export default function HNBest(props: Props) {
  const { posts } = props
  return (
    <Page withHeader>
      <NextSeo
        title={'Hacker News · Best'}
        description={'My personal Hacker News reader.'}
        openGraph={{
          url: 'https://brianlovin.com/hn/best',
          title: 'Hacker News · Best',
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
          <Navigation active={'best'} />
          <HNPosts posts={posts} />
          <HNSubscribeBox />
        </Grid>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const posts = await getHNPosts('best')

  return {
    unstable_revalidate: 60 * 60 * 24,
    props: {
      posts,
    },
  }
}
