import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { NextSeo } from 'next-seo'
import BookmarksList from '~/components/Bookmarks'
import { useAuth } from '~/hooks/useAuth'
import AddBookmark from '~/components/Bookmarks/AddBookmark'
import { CenteredColumn, ListViewOnly } from '~/components/Layouts'
import BookmarksNavigation from '~/components/Bookmarks/BookmarksNavigation'
import routes from '~/config/routes'
import Link from 'next/link'

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
