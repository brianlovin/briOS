import { gql } from '@apollo/client'
import { UserInfoFragment } from '../fragments'

export const DELETE_USER = gql`
  mutation deleteUser {
    deleteUser
  }
`

export const EDIT_USER = gql`
  mutation editUser($data: EditUserInput) {
    editUser(data: $data) {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`
