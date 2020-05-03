import { gql } from '@apollo/client'

export const RepoInfoFragment = gql`
  fragment RepoInfo on Repo {
    org
    name
    description
    stars
  }
`
