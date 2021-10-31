import { gql } from '@apollo/client'

import {
  HackerNewsListItemInfoFragment,
  HackerNewsPostInfoFragment,
} from '../fragments/hackerNewsPost'

export const GET_HACKER_NEWS_POSTS = gql`
  query getHackerNewsPosts {
    hackerNewsPosts {
      ...HackerNewsListItemInfo
    }
  }
  ${HackerNewsListItemInfoFragment}
`

export const GET_HACKER_NEWS_POST = gql`
  query getHackerNewsPost($id: ID!) {
    hackerNewsPost(id: $id) {
      ...HackerNewsPostInfo
    }
  }
  ${HackerNewsPostInfoFragment}
`
