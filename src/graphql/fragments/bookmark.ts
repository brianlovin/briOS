import { gql } from '@apollo/client'

export const BookmarkInfoFragment = gql`
  fragment BookmarkInfo on Bookmark {
    __typename
    id
    createdAt
    url
    host
    title
    image
    siteName
    description
  }
`
