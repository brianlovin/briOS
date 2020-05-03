import { PostInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const getPosts = gql`
  query GetPosts {
    posts {
      ...PostInfo
    }
  }
  ${PostInfoFragment}
`
