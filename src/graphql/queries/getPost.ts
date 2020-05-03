import { PostInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const getPost = gql`
  query GetPost($slug: String!, $first: Int) {
    post(slug: $slug) {
      ...PostInfo
    }
    posts(first: $first) {
      ...PostInfo
    }
  }
  ${PostInfoFragment}
`
