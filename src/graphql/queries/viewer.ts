import { gql } from '@apollo/client'
import { UserInfoFragment } from '../fragments'

export const GET_VIEWER_QUERY = gql`
  query viewer {
    viewer {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`
