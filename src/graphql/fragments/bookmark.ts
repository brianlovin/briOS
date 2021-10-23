import { gql } from '@apollo/client'

export const BookmarkInfoFragment = gql`
  fragment BookmarkInfo on Bookmark {
    __typename
    id
    url
    host
    title
    description
  }
`

export const BookmarkInfoWithTagsFragment = gql`
  fragment BookmarkInfoWithTags on Bookmark {
    ...BookmarkInfo
    tags {
      name
    }
  }
  ${BookmarkInfoFragment}
`
