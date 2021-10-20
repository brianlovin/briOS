import { gql } from '@apollo/client'
import { StackInfoFragment } from '../fragments/stack'

export const GET_STACKS = gql`
  query getStacks {
    stacks {
      ...StackInfo
    }
  }
  ${StackInfoFragment}
`

export const GET_STACK = gql`
  query getStack($id: ID!) {
    stack(id: $id) {
      ...StackInfo
    }
  }
  ${StackInfoFragment}
`
