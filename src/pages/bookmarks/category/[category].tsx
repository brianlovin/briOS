import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { withApollo } from '~/components/withApollo'
import BookmarksPage from '~/components/Bookmarks/Page'
import { useRouter } from 'next/router'

function Bookmarks() {
  const router = useRouter()
  const { category } = router.query
  return <BookmarksPage category={category} />
}

export async function getStaticPaths() {
  const categories = ['reading', 'portfolio', 'website']
  const paths = categories.map((category) => ({
    params: { category },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { category } }) {
  const client = await initApolloClient({})
  await client.query({ query: GET_BOOKMARKS, variables: { category } })
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

export default withApollo(Bookmarks)
