import { gql } from '@apollo/client'
import { CommentInfoFragment } from './comment'
import { UserInfoFragment } from './user'

export const QuestionInfoFragment = gql`
  fragment QuestionInfo on Question {
    id
    createdAt
    updatedAt
    title
    description
    commentCount
    author {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
  ${CommentInfoFragment}
`
