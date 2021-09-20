import * as React from 'react'
import { GET_BOOKMARKS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { withApollo } from '~/components/withApollo'
import { ListViewOnly } from '~/components/Layouts'
import BookmarksList from '~/components/Bookmarks'

function Bookmarks({ data }) {
  return <ListViewOnly list={<BookmarksList bookmarks={data.bookmarks} />} />
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  const { data } = await client.query({
    query: GET_BOOKMARKS,
    variables: { category: undefined },
  })

  return {
    revalidate: 60 * 60,
    props: {
      data,
    },
  }
}

export default withApollo(Bookmarks)
