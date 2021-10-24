import { gql } from '@apollo/client'

import { BookmarkInfoWithTagsFragment } from '../fragments/bookmark'

export const GET_BOOKMARKS = gql`
  query GetBookmarks($tag: String) {
    bookmarks(tag: $tag) {
      ...BookmarkInfoWithTags
    }
  }
  ${BookmarkInfoWithTagsFragment}
`

export const GET_BOOKMARK = gql`
  query GetBookmark($id: ID!) {
    bookmark(id: $id) {
      ...BookmarkInfoWithTags
    }
  }
  ${BookmarkInfoWithTagsFragment}
`
