import { gql } from '@apollo/client'

import { UserInfoFragment } from './user'

export const PostInfoFragment = gql`
  fragment PostInfo on Post {
    id
    createdAt
    updatedAt
    publishedAt
    title
    slug
    excerpt
    featureImage
    reactionCount
    viewerHasReacted
    author {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`
