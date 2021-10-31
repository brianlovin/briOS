import { gql } from '@apollo/client'

import { PostInfoFragment } from '~/graphql/fragments/post'

export const GET_POSTS = gql`
  query getPosts {
    posts {
      ...PostInfo
    }
  }
  ${PostInfoFragment}
`

export const GET_POST = gql`
  query getPost($slug: String!) {
    post(slug: $slug) {
      ...PostInfo
      text
    }
  }
  ${PostInfoFragment}
`
