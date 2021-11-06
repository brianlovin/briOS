import { gql } from '@apollo/client'

import { CommentInfoFragment } from '~/graphql/fragments/comment'

export const ADD_COMMENT = gql`
  mutation addComment($refId: ID!, $type: CommentType!, $text: String!) {
    addComment(refId: $refId, type: $type, text: $text) {
      ...CommentInfo
    }
  }
  ${CommentInfoFragment}
`

export const EDIT_COMMENT = gql`
  mutation editComment($id: ID!, $text: String!) {
    editComment(id: $id, text: $text) {
      ...CommentInfo
    }
  }
  ${CommentInfoFragment}
`

export const DELETE_COMMENT = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`
