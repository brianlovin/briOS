import { gql } from '@apollo/client'

export const PostCoreFragment = gql`
  fragment PostCore on Post {
    __typename
    id
    publishedAt
    title
    slug
    excerpt
  }
`

export const PostListItemFragment = gql`
  fragment PostListItem on Post {
    ...PostCore
  }
  ${PostCoreFragment}
`

export const PostDetailFragment = gql`
  fragment PostDetail on Post {
    ...PostCore
    text
    featureImage
    reactionCount
  }
  ${PostCoreFragment}
`
