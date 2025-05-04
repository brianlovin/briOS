import { gql } from '@apollo/client'

export const TOGGLE_REACTION = gql`
  mutation toggleReaction($refId: ID!, $type: ReactionType!) {
    toggleReaction(refId: $refId, type: $type) {
      ... on Stack {
        id
        reactionCount
      }
      ... on Bookmark {
        id
        url
        reactionCount
      }
      ... on Question {
        id
        reactionCount
      }
      ... on Post {
        id
        reactionCount
      }
    }
  }
`
