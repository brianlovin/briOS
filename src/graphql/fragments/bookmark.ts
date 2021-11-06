import { gql } from '@apollo/client'

export const BookmarkInfoFragment = gql`
  fragment BookmarkInfo on Bookmark {
    __typename
    id
    url
    host
    title
    description
    faviconUrl
    reactionCount
    viewerHasReacted
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

export const BookmarksConnectionFragment = gql`
  fragment BookmarksConnection on BookmarksConnection {
    pageInfo {
      hasNextPage
      totalCount
      endCursor
    }
    edges {
      cursor
      node {
        ...BookmarkInfoWithTags
      }
    }
  }
  ${BookmarkInfoWithTagsFragment}
`
