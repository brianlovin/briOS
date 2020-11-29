import * as React from 'react'
import Page from '~/components/Page'
import { withApollo } from '~/components/withApollo'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_AMA_QUESTIONS } from '~/graphql/queries/ama'
import AMAQuestions from '~/components/AMAQuestions'
import { CenteredColumn } from '~/components/Layouts'
import { NextSeo } from 'next-seo'
import { AmaStatus } from '~/graphql/types.generated'

function About() {
  return (
    <Page>
      <NextSeo
        title={'Ask Me Anything'}
        description={'Answering questions, just for fun.'}
        openGraph={{
          url: 'https://brianlovin.com/ama',
          title: 'Ask Me Anything',
          description: 'Answering questions, just for fun.',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/ama.png',
              alt: 'Ask Me Anything',
            },
          ],
        }}
      />
      <CenteredColumn>
        <div className="flex flex-col space-y-4">
          <h1>Ask Me Anything</h1>
          <p className="mb-2 page-subtitle">
            Just for fun! Questions will be visible after I’ve answered.
          </p>
          <AMAQuestions />
        </div>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  await client.query({
    query: GET_AMA_QUESTIONS,
    variables: { status: AmaStatus.Answered },
  })
  /*
    Because this is using withApollo, the data from this query will be
    pre-populated in the Apollo cache at build time. When the user first
    visits this page, we can retreive the data from the cache like this:

    const { data } = useGetBookmarksQuery({ fetchPolicy: 'cache-and-network' })

    This preserves the ability for the page to render all bookmarks instantly,
    then get progressively updated if any new bookmarks come in over the wire.
  */
  const apolloStaticCache = client.cache.extract()
  return {
    revalidate: 60 * 60,
    props: {
      apolloStaticCache,
    },
  }
}

export default withApollo(About)
