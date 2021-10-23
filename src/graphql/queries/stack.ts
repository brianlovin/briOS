import { gql } from '@apollo/client'
import { UserInfoFragment } from '~/graphql/fragments/user'
import {
  StackInfoFragment,
  StackInfoWithTagsFragment,
} from '../fragments/stack'

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
      ...StackInfoWithTags
      usedByViewer
      usedBy {
        ...UserInfo
      }
    }
  }
  ${StackInfoWithTagsFragment}
  ${UserInfoFragment}
`
