// @flow
import * as React from 'react'
import data from './data'
import { Grid, Spacer } from './style'
import BookCard from './BookCard'

type Props = {
  truncated: boolean
}

class BookGrid extends React.Component<Props> {
  render() {
    const { truncated } = this.props
    const books = truncated 
      ? data.slice(0, 5)
      : data
    
    return (
      <Grid>
        {
          books.map(book => (
            <BookCard truncated={truncated} key={book.url} book={book} />
          ))
        }

        <Spacer />
      </Grid>
    )
  }
}

export default BookGrid