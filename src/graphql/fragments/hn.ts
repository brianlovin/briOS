import { gql } from '@apollo/client'

export const HNPostFragment = gql`
  fragment HNPostInfo on HNPost {
    id
    title
    points
    user
    time_ago
    comments_count
    url
    domain
  }
`
