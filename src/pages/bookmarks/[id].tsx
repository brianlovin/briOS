import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { withApollo } from '~/components/withApollo'
import { ListDetailView } from '~/components/Layouts'
import BookmarksList from '~/components/Bookmarks'
import { GET_BOOKMARK } from '~/graphql/queries/bookmarks'
import { BookmarkDetail } from '~/components/Bookmarks/BookmarkDetail'

function Bookmarks({ data }) {
  return (
    <ListDetailView
      list={<BookmarksList bookmarks={data.bookmarks} />}
      detail={<BookmarkDetail bookmark={data.bookmark} />}
    />
  )
}

export async function getServerSideProps({ params: { id } }) {
  const client = await initApolloClient({})

  const { data: bookmarksData } = await client.query({
    query: GET_BOOKMARKS,
    variables: { category: undefined },
  })

  const { data: bookmarkData } = await client.query({
    query: GET_BOOKMARK,
    variables: { id },
  })

  return {
    props: {
      data: {
        bookmarks: bookmarksData.bookmarks,
        bookmark: bookmarkData.bookmark,
      },
    },
  }
}

export default withApollo(Bookmarks)
