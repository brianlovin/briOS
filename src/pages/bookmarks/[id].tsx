import * as React from 'react'

import { BookmarkDetail } from '~/components/Bookmarks/BookmarkDetail'
import { BookmarksList } from '~/components/Bookmarks/BookmarksList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { getContext } from '~/graphql/context'
import { GET_BOOKMARKS } from '~/graphql/queries/bookmarks'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { CommentType } from '~/graphql/types.generated'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function BookmarkPage({ id }) {
  return <BookmarkDetail id={id} />
}

export async function getServerSideProps({ params: { id }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await Promise.all([
    apolloClient.query({
      query: GET_BOOKMARKS,
    }),

    apolloClient.query({
      query: GET_BOOKMARK,
      variables: { id },
    }),

    apolloClient.query({
      query: GET_COMMENTS,
      variables: { refId: id, type: CommentType.Bookmark },
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
