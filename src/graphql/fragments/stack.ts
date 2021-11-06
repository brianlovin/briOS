import { gql } from '@apollo/client'

export const StackInfoFragment = gql`
  fragment StackInfo on Stack {
    __typename
    id
    createdAt
    updatedAt
    name
    description
    url
    image
    reactionCount
    viewerHasReacted
  }
`

export const StackInfoWithTagsFragment = gql`
  fragment StackInfoWithTags on Stack {
    ...StackInfo
    tags {
      name
    }
  }
  ${StackInfoFragment}
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
        ...StackInfo
      }
    }
  }
  ${StackInfoFragment}
`
