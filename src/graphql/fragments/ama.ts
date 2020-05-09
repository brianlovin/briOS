import { gql } from '@apollo/client'

export const AMAInfoFragment = gql`
  fragment AMAInfo on AMA {
    id
    createdAt
    updatedAt
    question
    answer
    status
    reactions
  }
`
