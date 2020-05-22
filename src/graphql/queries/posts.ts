import { PostInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      ...PostInfo
    }
  }
  ${PostInfoFragment}
`

export const GET_POST = gql`
  query GetPost($slug: String!, $first: Int) {
    post(slug: $slug) {
      ...PostInfo
    }
  }
  ${PostInfoFragment}
`
