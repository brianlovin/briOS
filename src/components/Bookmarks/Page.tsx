import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import BookmarksList from '~/components/Bookmarks'
import { useAuth } from '~/hooks/useAuth'
import AddBookmark from '~/components/Bookmarks/AddBookmark'
import { CenteredColumn } from '~/components/Layouts'
import BookmarksNavigation from '~/components/Bookmarks/BookmarksNavigation'

export default function BookmarksPage({ category }) {
  const { isMe } = useAuth()

  return (
    <Page>
      <NextSeo
        title={'Bookmarks'}
        description={'Internet things, saved for later.'}
        openGraph={{
          url: 'https://brianlovin.com/bookmarks',
          title: 'Bookmarks',
          description: 'Internet things, saved for later.',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/bookmarks.png',
              alt: 'Bookmarks',
            },
          ],
        }}
      />
      <CenteredColumn data-cy="bookmarks">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1>Bookmarks</h1>
            <p className="page-subtitle">Internet things, saved for later.</p>
          </div>
          <BookmarksNavigation />
          {isMe && <AddBookmark />}
          <BookmarksList category={category} />
        </div>
      </CenteredColumn>
    </Page>
  )
}
