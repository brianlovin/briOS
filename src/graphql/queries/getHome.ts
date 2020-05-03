import { PostInfoFragment, EpisodeInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const getHome = gql`
  query GetHome {
    posts(first: 5) {
      ...PostInfo
    }
    episodes {
      ...EpisodeInfo
    }
  }
  ${PostInfoFragment}
  ${EpisodeInfoFragment}
`
