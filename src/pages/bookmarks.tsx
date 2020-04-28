import * as React from 'react'
import Page, { SectionHeading } from '~/components/Page'
import { H3 } from '~/components/Typography'
import { Bookmark } from '~/types/graphql'
import BookmarksList from '~/components/Bookmarks'
import { fetcher } from '~/api'
import { BOOKMARKS } from '~/api/queries'

interface Props {
  data: {
    bookmarks: Bookmark[]
  }
}

function Bookmarks({ data }: Props) {
  return (
    <Page withHeader>
      <SectionHeading data-cy="bookmarks">
        <H3>Bookmarks</H3>
        {data && data.bookmarks && <BookmarksList bookmarks={data.bookmarks} />}
      </SectionHeading>
    </Page>
  )
}

export async function getStaticProps() {
  const data = await fetcher({ query: BOOKMARKS })
  return { props: { data }, unstable_revalidate: true }
}

export default Bookmarks
