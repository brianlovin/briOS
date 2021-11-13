import { gql } from '@apollo/client'

import {
  PostDetailFragment,
  PostListItemFragment,
} from '~/graphql/fragments/post'

export const GET_POSTS = gql`
  query getPosts($filter: WritingFilter) {
    posts(filter: $filter) {
      ...PostListItem
    }
  }
  ${PostListItemFragment}
`

export const GET_POST = gql`
  query getPost($slug: String!) {
    post(slug: $slug) {
      ...PostDetail
    }
  }
  ${PostDetailFragment}
`
