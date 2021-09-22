import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { ListViewOnly } from '~/components/Layouts'
import BookmarksList from '~/components/Bookmarks'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'

export default function BookmarksPage() {
  return <ListViewOnly list={<BookmarksList />} />
}

export async function getServerSideProps() {
  const apolloClient = initApolloClient()

  await apolloClient.query({
    query: GET_BOOKMARKS,
    variables: { category: undefined },
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}
