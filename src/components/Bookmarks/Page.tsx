import * as React from 'react'
import { NextSeo } from 'next-seo'
import BookmarksList from '~/components/Bookmarks'
import { useAuth } from '~/hooks/useAuth'
import { ListViewOnly } from '~/components/Layouts'
import routes from '~/config/routes'

export default function BookmarksPage({ category }) {
  const { isMe } = useAuth()

  return (
    <>
      <NextSeo
        title={routes.bookmarks.seo.title}
        description={routes.bookmarks.seo.description}
        openGraph={routes.bookmarks.seo.openGraph}
      />

      <ListViewOnly list={<BookmarksList category={category} />} />
    </>
  )
}
