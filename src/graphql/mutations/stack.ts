import { gql } from '@apollo/client'

import { StackCoreFragment, StackDetailFragment } from '../fragments/stack'
import { UserInfoFragment } from '../fragments/user'

export const EDIT_STACK = gql`
  mutation editStack($id: ID!, $data: EditStackInput!) {
    editStack(id: $id, data: $data) {
      ...StackDetail
    }
  }
  ${StackDetailFragment}
`

export const DELETE_STACK = gql`
  mutation deleteStack($id: ID!) {
    deleteStack(id: $id)
  }
`

export const ADD_STACK = gql`
  mutation addStack($data: AddStackInput!) {
    addStack(data: $data) {
      ...StackDetail
    }
  }
  ${StackDetailFragment}
`

export const TOGGLE_STACK_USER = gql`
  mutation toggleStackUser($id: ID!) {
    toggleStackUser(id: $id) {
      ...StackCore
      usedBy {
        ...UserInfo
      }
    }
  }
  ${StackCoreFragment}
  ${UserInfoFragment}
`
