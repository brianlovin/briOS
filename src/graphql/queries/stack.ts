import { gql } from '@apollo/client'

import { UserInfoFragment } from '~/graphql/fragments/user'

import {
  StackInfoWithTagsFragment,
  StacksConnectionFragment,
} from '../fragments/stack'

export const GET_STACKS = gql`
  query getStacks($first: Int, $after: String) {
    stacks(first: $first, after: $after) {
      ...StacksConnection
    }
  }
  ${StacksConnectionFragment}
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
