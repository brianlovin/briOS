import { gql } from '@apollo/client'

import { UserInfoFragment } from './user'

export const StackCoreFragment = gql`
  fragment StackCore on Stack {
    __typename
    id
    name
    image
    url
    slug
  }
`

export const StackListItemFragment = gql`
  fragment StackListItem on Stack {
    ...StackCore
  }
  ${StackCoreFragment}
`

export const StackDetailFragment = gql`
  fragment StackDetail on Stack {
    ...StackCore
    createdAt
    description
    reactionCount
    usedBy {
      ...UserInfo
    }
    tags {
      name
    }
  }
  ${StackCoreFragment}
  ${UserInfoFragment}
`

export const StacksConnectionFragment = gql`
  fragment StacksConnection on StacksConnection {
    pageInfo {
      hasNextPage
      totalCount
      endCursor
    }
    edges {
      cursor
      node {
        ...StackListItem
      }
    }
  }
  ${StackListItemFragment}
`
