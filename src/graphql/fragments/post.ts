import { gql } from '@apollo/client'

export const PostInfoFragment = gql`
  fragment PostInfo on Post {
    id
    title
    slug
    updated_at
    publishedAt
    excerpt
    feature_image
    html
  }
`
