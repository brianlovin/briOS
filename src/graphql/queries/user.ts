import { gql } from '@apollo/client'

import { UserInfoFragment } from '~/graphql/fragments/user'

export const GET_USER = gql`
  query getUser($username: String!) {
    user(username: $username) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`
