import { gql } from '@apollo/client'

export const BookmarkCoreFragment = gql`
  fragment BookmarkCore on Bookmark {
    __typename
    id
    url
    host
    title
    description
    faviconUrl
  }
`

export const BookmarkListItemFragment = gql`
  fragment BookmarkListItem on Bookmark {
    ...BookmarkCore
  }
  ${BookmarkCoreFragment}
`

export const BookmarkDetailFragment = gql`
  fragment BookmarkDetail on Bookmark {
    ...BookmarkCore
    reactionCount
    tags {
      name
    }
  }
  ${BookmarkCoreFragment}
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
        ...BookmarkListItem
      }
    }
  }
  ${BookmarkListItemFragment}
`
