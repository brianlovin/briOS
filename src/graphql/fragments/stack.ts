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
