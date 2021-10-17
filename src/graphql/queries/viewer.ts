import { gql } from '@apollo/client'
import { UserInfoFragment } from '../fragments'
import { UserSettingsFragment } from '../fragments/user'

export const GET_VIEWER_QUERY = gql`
  query viewer {
    viewer {
      ...UserInfo
    }
  }
  ${UserInfoFragment}
`

export const GET_VIEWER_SETTINGS = gql`
  query getViewerWithSettings {
    viewer {
      ...UserInfo
      ...UserSettings
    }
  }
  ${UserInfoFragment}
  ${UserSettingsFragment}
`
