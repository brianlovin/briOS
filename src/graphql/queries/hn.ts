import { HNPostFragment } from '../fragments'
import { gql } from '@apollo/client'

export const GET_TOP_HN_POSTS = gql`
  query GetTopHNPosts($sort: String) {
    hnPosts(sort: $sort) {
      ...HNPostInfo
    }
  }
  ${HNPostFragment}
`

export const GET_HN_POST = gql`
  query GetHNPost($id: ID!) {
    hnPost(id: $id) {
      ...HNPostInfo
      comments
    }
  }
  ${HNPostFragment}
`
