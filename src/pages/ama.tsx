import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { withApollo } from '~/components/withApollo'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_AMA_QUESTIONS } from '~/graphql/queries/ama'
import AMAQuestions from '~/components/AMAQuestions'
import { CenteredColumn } from '~/components/Layouts'
import { NextSeo } from 'next-seo'
import { AmaStatus } from '~/graphql/types.generated'
import routes from '~/config/routes'
import Link from 'next/link'

function About() {
  return (
    <Page>
      <NextSeo
        title={routes.ama.seo.title}
        description={routes.ama.seo.description}
        openGraph={routes.ama.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-8">
          <Link href="/projects" passHref>
            <a className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
              &larr; Projects
            </a>
          </Link>
          <PageHeader
            title="Ask Me Anything"
            subtitle="Just for fun! Questions will be visible after I’ve answered."
          />
          <AMAQuestions />
        </div>
      </CenteredColumn>
    </Page>
  )
}

export async function getServerSideProps() {
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
    props: {
      apolloStaticCache,
    },
  }
}

export default withApollo(About)
