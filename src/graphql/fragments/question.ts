import { gql } from '@apollo/client'

import { UserInfoFragment } from './user'

export const QuestionCoreFragment = gql`
  fragment QuestionCore on Question {
    __typename
    id
    title
    createdAt
    author {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`

export const QuestionListItemFragment = gql`
  fragment QuestionListItem on Question {
    ...QuestionCore
  }
  ${QuestionCoreFragment}
`

export const QuestionDetailFragment = gql`
  fragment QuestionDetail on Question {
    ...QuestionCore
    description
    status
    reactionCount
  }
  ${QuestionCoreFragment}
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
        ...QuestionListItem
      }
    }
  }
  ${QuestionListItemFragment}
`
