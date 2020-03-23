import * as React from 'react';
import Page, { SectionHeading } from '~/components/Page';
import { H3 } from '~/components/Typography'
import { Bookmark } from '~/types'
import BookmarksList from '~/components/Bookmarks'
import { fetcher } from '~/api';
import { BOOKMARKS } from '~/api/queries';
import useSWR from 'swr';

interface Props {
  data: {
    bookmarks: Bookmark[]
  }
}

function Bookmarks(props: Props) {
  const { data, error } = useSWR(BOOKMARKS, query => fetcher({ query }), { initialData: props.data })
  
  if (error) return null

  return (
    <Page withHeader>
      <SectionHeading data-cy="bookmarks">
        <H3>Bookmarks</H3>
        {data && data.bookmarks && <BookmarksList bookmarks={data.bookmarks} />}
      </SectionHeading>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await fetcher({ query: BOOKMARKS })
  return { props: { data }}
}

export default Bookmarks