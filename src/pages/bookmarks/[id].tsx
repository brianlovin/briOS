import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import BookmarksList from '~/components/Bookmarks'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import { BookmarkDetail } from '~/components/Bookmarks/BookmarkDetail'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { withProviders } from '~/components/Providers/withProviders'

function BookmarkPage({ id }) {
  return <BookmarkDetail id={id} />
}

export async function getServerSideProps({ params: { id } }) {
  const apolloClient = initApolloClient()

  await Promise.all([
    apolloClient.query({
      query: GET_BOOKMARKS,
    }),

    apolloClient.query({
      query: GET_BOOKMARK,
      variables: { id },
    }),
  ])

  return addApolloState(apolloClient, {
    props: {
      id,
    },
  })
}

BookmarkPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<BookmarksList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default BookmarkPage
