import * as React from 'react';
import Page, { SectionHeading } from '~/components/Page';
import { H3 } from '~/components/Typography'
import { Bookmark } from '~/types'
import BookmarksList from '~/components/Bookmarks'
import { fetcher } from '~/api';
import { BOOKMARKS } from '~/api/queries';

interface Props {
  bookmarks?: Bookmark[]
}

function Bookmarks({ bookmarks }: Props) {
  return (
    <Page withHeader>
      <SectionHeading data-cy="bookmarks">
        <H3>Bookmarks</H3>
        <BookmarksList bookmarks={bookmarks} />
      </SectionHeading>
    </Page>
  );
}

export async function getStaticProps() {
  const { bookmarks } = await fetcher(BOOKMARKS)
  return { props: { bookmarks }}
}

export default Bookmarks