import { gql } from '@apollo/client'

import { PostInfoFragment } from '~/graphql/fragments/post'

export const EDIT_POST = gql`
  mutation editPost($id: ID!, $data: EditPostInput!) {
    editPost(id: $id, data: $data) {
      ...PostInfo
      text
    }
  }
  ${PostInfoFragment}
`

export const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`

export const ADD_POST = gql`
  mutation addPost($data: AddPostInput!) {
    addPost(data: $data) {
      ...PostInfo
      text
    }
  }
  ${PostInfoFragment}
`
