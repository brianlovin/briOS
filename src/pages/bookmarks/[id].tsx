import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { ListDetailView } from '~/components/Layouts'
import BookmarksList from '~/components/Bookmarks'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import { BookmarkDetail } from '~/components/Bookmarks/BookmarkDetail'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'

export default function BookmarksPage({ id }) {
  return (
    <ListDetailView
      list={<BookmarksList />}
      detail={<BookmarkDetail id={id} />}
    />
  )
}

export async function getServerSideProps({ params: { id } }) {
  const apolloClient = initApolloClient()

  await Promise.all([
    apolloClient.query({
      query: GET_BOOKMARKS,
      variables: { category: undefined },
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
