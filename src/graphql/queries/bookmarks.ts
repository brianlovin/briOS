import { BookmarkInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const GET_BOOKMARKS = gql`
  query GetBookmarks($skip: Int, $category: String) {
    bookmarks(skip: $skip, category: $category) {
      ...BookmarkInfo
    }
  }
  ${BookmarkInfoFragment}
`

export const GET_BOOKMARK = gql`
  query GetBookmark($id: ID!) {
    bookmark(id: $id) {
      ...BookmarkInfo
    }
  }
  ${BookmarkInfoFragment}
`
