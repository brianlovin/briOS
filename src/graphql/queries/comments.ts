import { CommentInfoFragment } from '~/graphql/fragments/comment'
import { gql } from '@apollo/client'

export const GET_COMMENTS = gql`
  query getComments($refId: String, $type: CommentType) {
    comments(refId: $refId, type: $type) {
      ...CommentInfo
    }
  }
  ${CommentInfoFragment}
`
