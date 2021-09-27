import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import BookmarksList from '~/components/Bookmarks'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import { BookmarkDetail } from '~/components/Bookmarks/BookmarkDetail'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { withProviders } from '~/components/Providers/withProviders'
import { getViewer } from '~/graphql/context'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { CommentType } from '~/graphql/types.generated'

function BookmarkPage({ id }) {
  return <BookmarkDetail id={id} />
}

export async function getServerSideProps({ params: { id }, req, res }) {
  const viewer = await getViewer(req, res)
  const apolloClient = initApolloClient({ viewer })

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
