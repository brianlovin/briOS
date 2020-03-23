import * as React from 'react';
import Page, { SectionHeading } from '~/components/Page';
import { H3 } from '~/components/Typography'
import { Bookmark } from '~/types'
import BookmarksList from '~/components/Bookmarks'
import { fetcher, swr } from '~/api';
import { BOOKMARKS } from '~/api/queries';

interface Props {
  data: {
    bookmarks?: Bookmark[]
  }
}

function Bookmarks(props: Props) {
  const { data, error } = swr({ query: BOOKMARKS, initialData: props.data })

  if (error) return null

  if (!data) return null

  return (
    <Page withHeader>
      <SectionHeading data-cy="bookmarks">
        <H3>Bookmarks</H3>
        <BookmarksList bookmarks={data.bookmarks} />
      </SectionHeading>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await fetcher(BOOKMARKS)
  return { props: { data }}
}

export default Bookmarks