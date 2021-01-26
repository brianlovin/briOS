import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
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
          url: 'https://paulowe.com/bookmarks',
          title: 'Bookmarks',
          description: 'Internet things, saved for later.',
          images: [
            {
              url: 'https://paulowe.com/static/meta/bookmarks.jpeg',
              alt: 'Bookmarks',
            },
          ],
        }}
      />
      <CenteredColumn data-cy="bookmarks">
        <div className="flex flex-col space-y-8">
          <PageHeader
            title="Bookmarks"
            subtitle="Internet things, saved for later."
          />
          <BookmarksNavigation />
          {isMe && <AddBookmark />}
          <BookmarksList category={category} />
        </div>
      </CenteredColumn>
    </Page>
  )
}
