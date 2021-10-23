import { UserInfoFragment } from '~/graphql/fragments/user'
import { gql } from '@apollo/client'

export const GET_USER = gql`
  query getUser($username: String!) {
    user(username: $username) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`
