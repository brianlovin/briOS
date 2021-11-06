import { gql } from '@apollo/client'

import { UserInfoFragment } from './user'

export const QuestionInfoFragment = gql`
  fragment QuestionInfo on Question {
    id
    createdAt
    updatedAt
    title
    description
    status
    reactionCount
    viewerHasReacted
    author {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`

export const QuestionsConnectionFragment = gql`
  fragment QuestionsConnection on QuestionsConnection {
    pageInfo {
      hasNextPage
      totalCount
      endCursor
    }
    edges {
      cursor
      node {
        ...QuestionInfo
      }
    }
  }
  ${QuestionInfoFragment}
`
