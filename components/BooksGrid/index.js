// @flow
import * as React from 'react';
import data from '../../config/books';
import { Grid, Spacer } from './style';
import BookCard from './BookCard';

type Props = {
  truncated: boolean,
};

export default function BookGrid(props: Props) {
  const { truncated } = props;
  const books = truncated ? data.slice(0, 5) : data;

  return (
    <Grid data-cy="books">
      {books.map(book => (
        <BookCard truncated={truncated} key={book.url} book={book} />
      ))}

      <Spacer />
    </Grid>
  );
}
