import { gql } from '@apollo/client'

export const BookmarkInfoFragment = gql`
  fragment BookmarkInfo on Bookmark {
    id
    title
    url
    host
    reactions
    notes
    category
    twitterHandle
  }
`
