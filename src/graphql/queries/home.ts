import { PostInfoFragment, EpisodeInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const GET_HOME = gql`
  query GetHome {
    recent: posts(first: 12) {
      ...PostInfo
    }
    popular: posts(
      first: 12
      filter: "tag:popular"
      order: "published_at ASC"
    ) {
      ...PostInfo
    }
    episodes {
      ...EpisodeInfo
    }
  }
  ${PostInfoFragment}
  ${EpisodeInfoFragment}
`
