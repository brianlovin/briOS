import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import { GET_TOP_HN_POSTS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { withApollo } from '~/components/withApollo'
import { CenteredColumn } from '~/components/Layouts'
import HNPosts from '~/components/HNPosts'
import Grid from '~/components/Grid'
import { H3 } from '~/components/Typography'
import Navigation from '~/components/HNPosts/Navigation'

function HNBest() {
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
          <HNPosts sort={'best'} />
        </Grid>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  await client.query({ query: GET_TOP_HN_POSTS, variables: { sort: 'best' } })
  /*
    Because this is using withApollo, the data from this query will be
    pre-populated in the Apollo cache at build time. When the user first
    visits this page, we can retreive the data from the cache like this:

    const { data } = useGetTopHNPostsQuery({ fetchPolicy: 'cache-and-network' })

    This preserves the ability for the page to render all posts instantly,
    then get progressively updated if any new posts come in over the wire.
  */
  const apolloStaticCache = client.cache.extract()
  return {
    // update daily
    unstable_revalidate: 60 * 60 * 24,
    props: {
      apolloStaticCache,
    },
  }
}

export default withApollo(HNBest)
