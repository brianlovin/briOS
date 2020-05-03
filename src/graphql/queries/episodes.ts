import { EpisodeInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const GET_EPISODES = gql`
  query GetEpisodes {
    episodes {
      ...EpisodeInfo
    }
  }
  ${EpisodeInfoFragment}
`
