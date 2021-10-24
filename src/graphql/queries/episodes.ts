import { gql } from '@apollo/client'

import { EpisodeInfoFragment } from '~/graphql/fragments/episode'

export const GET_EPISODES = gql`
  query GetEpisodes {
    episodes {
      ...EpisodeInfo
    }
  }
  ${EpisodeInfoFragment}
`
