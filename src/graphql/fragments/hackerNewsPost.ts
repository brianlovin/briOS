import { gql } from '@apollo/client'

export const HackerNewsListItemInfoFragment = gql`
  fragment HackerNewsListItemInfo on HackerNewsPost {
    id
    title
    domain
    url
  }
`

export const HackerNewsCommentInfoFragment = gql`
  fragment HackerNewsCommentInfo on HackerNewsComment {
    id
    user
    comments_count
    time_ago
    level
    content
  }
`

export const HackerNewsPostInfoFragment = gql`
  fragment HackerNewsPostInfo on HackerNewsPost {
    ...HackerNewsListItemInfo
    user
    time
    time_ago
    comments_count
    url
    domain
    content
    comments {
      ...HackerNewsCommentInfo
      comments {
        ...HackerNewsCommentInfo
        comments {
          ...HackerNewsCommentInfo
          comments {
            ...HackerNewsCommentInfo
          }
        }
      }
    }
  }
  ${HackerNewsListItemInfoFragment}
  ${HackerNewsCommentInfoFragment}
`
