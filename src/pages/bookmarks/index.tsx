import { NextSeo } from 'next-seo'
import * as React from 'react'

import { BookmarksList } from '~/components/Bookmarks/BookmarksList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { getContext } from '~/graphql/context'
import { GET_BOOKMARKS } from '~/graphql/queries/bookmarks'
import { GET_TAGS } from '~/graphql/queries/tags'
import { GET_VIEWER } from '~/graphql/queries/viewer'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function BookmarksPage() {
  return (
    <NextSeo
      title={routes.bookmarks.seo.title}
      description={routes.bookmarks.seo.description}
      openGraph={routes.bookmarks.seo.openGraph}
    />
  )
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
