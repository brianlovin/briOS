import * as React from 'react'
import { NextSeo } from 'next-seo'
import BookmarksList from '~/components/Bookmarks'
import { ListDetailView } from '~/components/Layouts'
import routes from '~/config/routes'

export default function BookmarksPage() {
  return (
    <>
      <NextSeo
        title={routes.bookmarks.seo.title}
        description={routes.bookmarks.seo.description}
        openGraph={routes.bookmarks.seo.openGraph}
      />

      <ListDetailView detail={null} list={<BookmarksList />} />
    </>
  )
}
