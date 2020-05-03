import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($password: String!) {
    login(password: $password)
  }
`

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`
