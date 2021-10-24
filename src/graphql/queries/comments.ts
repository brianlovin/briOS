import { gql } from '@apollo/client'

import { CommentInfoFragment } from '~/graphql/fragments/comment'

export const GET_COMMENTS = gql`
  query getComments($refId: String, $type: CommentType) {
    comments(refId: $refId, type: $type) {
      ...CommentInfo
    }
  }
  ${CommentInfoFragment}
`
