import { gql } from '@apollo/client'

import { QuestionInfoFragment } from '~/graphql/fragments/question'

export const GET_QUESTIONS = gql`
  query getQuestions {
    questions {
      ...QuestionInfo
    }
  }
  ${QuestionInfoFragment}
`

export const GET_QUESTION = gql`
  query getQuestion($id: ID!) {
    question(id: $id) {
      ...QuestionInfo
    }
  }
  ${QuestionInfoFragment}
`
