import { gql } from '@apollo/client'

import { PostInfoFragment } from '~/graphql/fragments/post'

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      ...PostInfo
    }
  }
  ${PostInfoFragment}
`

export const GET_POST = gql`
  query GetPost($slug: String!) {
    post(slug: $slug) {
      ...PostInfo
      html
    }
  }
  ${PostInfoFragment}
`
