import * as React from 'react'
import Page, { SectionHeading } from '~/components/Page'
import { H3 } from '~/components/Typography'
import { Bookmark } from '~/types/graphql'
import BookmarksList from '~/components/Bookmarks'
import { fetcher } from '~/graphql/api'
import { getBookmarks } from '~/graphql/queries/queries'

interface Props {
  data: {
    bookmarks: Bookmark[]
  }
}

function Bookmarks({ data }: Props) {
  const bookmarks = data?.bookmarks
  return (
    <Page withHeader>
      <SectionHeading data-cy="bookmarks">
        <H3>Bookmarks</H3>
        {bookmarks && <BookmarksList bookmarks={bookmarks} />}
      </SectionHeading>
    </Page>
  )
}

export async function getStaticProps() {
  const data = await fetcher({ query: getBookmarks })
  return { props: { data }, unstable_revalidate: true }
}

export default Bookmarks
