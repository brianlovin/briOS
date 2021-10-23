import { gql } from '@apollo/client'
import { UserInfoFragment } from '~/graphql/fragments/user'
import { StackInfoWithTagsFragment } from '~/graphql/fragments/stack'

export const EDIT_STACK = gql`
  mutation editStack($id: ID!, $data: EditStackInput!) {
    editStack(id: $id, data: $data) {
      ...StackInfoWithTags
    }
  }
  ${StackInfoWithTagsFragment}
`

export const DELETE_STACK = gql`
  mutation deleteStack($id: ID!) {
    deleteStack(id: $id)
  }
`

export const ADD_STACK = gql`
  mutation addStack($data: AddStackInput!) {
    addStack(data: $data) {
      ...StackInfoWithTags
    }
  }
  ${StackInfoWithTagsFragment}
`

export const TOGGLE_STACK_USER = gql`
  mutation toggleStackUser($id: ID!) {
    toggleStackUser(id: $id) {
      id
      usedBy {
        ...UserInfo
      }
    }
  }
  ${UserInfoFragment}
`
