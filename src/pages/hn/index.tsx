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

function HNTop() {
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
          <HNPosts sort={'top'} />
        </Grid>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  await client.query({ query: GET_TOP_HN_POSTS, variables: { sort: 'top' } })
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
    unstable_revalidate: 60 * 60 * 4,
    props: {
      apolloStaticCache,
    },
  }
}

export default withApollo(HNTop)
