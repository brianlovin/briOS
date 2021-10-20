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
