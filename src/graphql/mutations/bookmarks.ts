import { gql } from '@apollo/client'
import { BookmarkInfoFragment, CommentInfoFragment } from '../fragments'

export const EDIT_BOOKMARK = gql`
  mutation editBookmark($id: ID!, $title: String!) {
    editBookmark(id: $id, title: $title) {
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
  mutation addBookmark($url: String!) {
    addBookmark(url: $url) {
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
