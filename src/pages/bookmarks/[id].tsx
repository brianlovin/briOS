import * as React from 'react'

import { BookmarkDetail } from '~/components/Bookmarks/BookmarkDetail'
import { BookmarksList } from '~/components/Bookmarks/BookmarksList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'

function BookmarkPage({ id }) {
  return <BookmarkDetail id={id} />
}

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  }
}

BookmarkPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<BookmarksList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default BookmarkPage
