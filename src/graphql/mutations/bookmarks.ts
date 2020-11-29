import { gql } from '@apollo/client'
import { BookmarkInfoFragment } from '../fragments'

export const EDIT_BOOKMARK = gql`
  mutation editBookmark(
    $id: ID!
    $title: String!
    $notes: String
    $category: String
    $twitterHandle: String
  ) {
    editBookmark(
      id: $id
      title: $title
      notes: $notes
      category: $category
      twitterHandle: $twitterHandle
    ) {
      ...BookmarkInfo
    }
  }
  ${BookmarkInfoFragment}
`

export const DELETE_BOOKMARK = gql`
  mutation deleteBookmark($id: ID!) {
    deleteBookmark(id: $id)
  }
`

export const ADD_BOOKMARK = gql`
  mutation addBookmark(
    $url: String!
    $notes: String
    $category: String
    $twitterHandle: String
  ) {
    addBookmark(
      url: $url
      notes: $notes
      category: $category
      twitterHandle: $twitterHandle
    ) {
      ...BookmarkInfo
    }
  }
  ${BookmarkInfoFragment}
`

export const ADD_BOOKMARK_REACTION = gql`
  mutation addBookmarkReaction($id: ID!) {
    addBookmarkReaction(id: $id) {
      ...BookmarkInfo
    }
  }
  ${BookmarkInfoFragment}
`
