import { gql } from '@apollo/client'
import { AMAInfoFragment } from '../fragments'

export const EDIT_AMA_QUESTION = gql`
  mutation editAMAQuestion(
    $id: ID!
    $question: String!
    $answer: String!
    $status: AMAStatus!
  ) {
    editAMAQuestion(
      id: $id
      question: $question
      answer: $answer
      status: $status
    ) {
      ...AMAInfo
    }
  }
  ${AMAInfoFragment}
`

export const DELETE_AMA_QUESTION = gql`
  mutation deleteAMAQuestion($id: ID!) {
    deleteAMAQuestion(id: $id)
  }
`

export const ADD_AMA_QUESTION = gql`
  mutation addAMAQuestion($question: String!) {
    addAMAQuestion(question: $question)
  }
  ${AMAInfoFragment}
`

export const ADD_AMA_QUESTION_REACTION = gql`
  mutation addAMAReaction($id: ID!) {
    addAMAReaction(id: $id) {
      ...AMAInfo
    }
  }
  ${AMAInfoFragment}
`
