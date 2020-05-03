import * as React from 'react'
import Page, { SectionHeading } from '~/components/Page'
import { H3 } from '~/components/Typography'
import { NextSeo } from 'next-seo'
import { useGetBookmarksQuery } from '~/graphql/types.generated'
import BookmarksList from '~/components/Bookmarks'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { useAuth } from '~/hooks/useAuth'
import AddBookmark from '~/components/Bookmarks/AddBookmark'
import { getStaticApolloClient } from '~/graphql/api'
import { withApollo } from '~/components/withApollo'

function Bookmarks() {
  const { data } = useGetBookmarksQuery({ fetchPolicy: 'cache-and-network' })
  const { bookmarks } = data
  const { isMe } = useAuth()

  return (
    <Page withHeader>
      <NextSeo title={'Bookmarks'} />
      <SectionHeading data-cy="bookmarks">
        <H3>Bookmarks</H3>
        {isMe && <AddBookmark />}
        {bookmarks && <BookmarksList bookmarks={bookmarks} />}
      </SectionHeading>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await getStaticApolloClient()
  await client.query({ query: GET_BOOKMARKS })
  return {
    props: {
      apolloStaticCache: client.cache.extract(),
    },
  }
}

export default withApollo(Bookmarks)
