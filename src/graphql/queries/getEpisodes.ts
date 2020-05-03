import { EpisodeInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const getEpisodes = gql`
  query GetEpisodes {
    episodes {
      ...EpisodeInfo
    }
  }
  ${EpisodeInfoFragment}
`
