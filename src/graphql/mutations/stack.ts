import { gql } from '@apollo/client'
import { UserInfoFragment } from '../fragments'
import { StackInfoFragment } from '../fragments/stack'

export const EDIT_STACK = gql`
  mutation editStack($id: ID!, $data: EditStackInput!) {
    editStack(id: $id, data: $data) {
      ...StackInfo
    }
  }
  ${StackInfoFragment}
`

export const DELETE_STACK = gql`
  mutation deleteStack($id: ID!) {
    deleteStack(id: $id)
  }
`

export const ADD_STACK = gql`
  mutation addStack($data: AddStackInput!) {
    addStack(data: $data) {
      ...StackInfo
    }
  }
  ${StackInfoFragment}
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
