import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import BookmarksList from '~/components/Bookmarks'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'

function BookmarksPage() {
  return null
}

export async function getServerSideProps() {
  const apolloClient = initApolloClient({})

  await apolloClient.query({
    query: GET_BOOKMARKS,
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}

BookmarksPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<BookmarksList />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export default BookmarksPage
