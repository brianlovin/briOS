import { gql } from '@apollo/client'

import {
  BookmarkDetailFragment,
  BookmarksConnectionFragment,
} from '../fragments/bookmark'

export const GET_BOOKMARKS = gql`
  query getBookmarks($first: Int, $after: String, $filter: BookmarkFilter) {
    bookmarks(first: $first, after: $after, filter: $filter) {
      ...BookmarksConnection
    }
  }
  ${BookmarksConnectionFragment}
`

export const GET_BOOKMARK = gql`
  query getBookmark($id: ID!) {
    bookmark(id: $id) {
      ...BookmarkDetail
    }
  }
  ${BookmarkDetailFragment}
`
