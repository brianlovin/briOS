import { gql } from '@apollo/client'

export const EpisodeInfoFragment = gql`
  fragment EpisodeInfo on Episode {
    id
    title
    description
  }
`
