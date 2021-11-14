import { gql } from '@apollo/client'

import { UserInfoFragment } from '~/graphql/fragments/user'

import { UserSettingsFragment } from '../fragments/user'

export const GET_VIEWER = gql`
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
