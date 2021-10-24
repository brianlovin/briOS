import { gql } from '@apollo/client'

import { BookmarkInfoWithTagsFragment } from '~/graphql/fragments/bookmark'

export const EDIT_BOOKMARK = gql`
  mutation editBookmark($id: ID!, $data: EditBookmarkInput!) {
    editBookmark(id: $id, data: $data) {
      ...BookmarkInfoWithTags
    }
  }
  ${BookmarkInfoWithTagsFragment}
`

export const DELETE_BOOKMARK = gql`
  mutation deleteBookmark($id: ID!) {
    deleteBookmark(id: $id)
  }
`

export const ADD_BOOKMARK = gql`
  mutation addBookmark($data: AddBookmarkInput!) {
    addBookmark(data: $data) {
      ...BookmarkInfoWithTags
    }
  }
  ${BookmarkInfoWithTagsFragment}
`
