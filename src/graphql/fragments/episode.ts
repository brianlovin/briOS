import { gql } from '@apollo/client'

export const EpisodeInfoFragment = gql`
  fragment EpisodeInfo on Episode {
    id
    description
    legacy_id
    long_description
    published_at
    status
    title
    token
  }
`
