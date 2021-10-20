import { gql } from '@apollo/client'
import { CommentInfoFragment } from './comment'
import { UserInfoFragment } from './user'

export const AMAInfoFragment = gql`
  fragment AMAInfo on AMA {
    id
    createdAt
    updatedAt
    text
    author {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
  ${CommentInfoFragment}
`
