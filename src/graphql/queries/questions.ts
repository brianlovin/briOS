import { gql } from '@apollo/client'

import {
  QuestionDetailFragment,
  QuestionsConnectionFragment,
} from '~/graphql/fragments/question'

export const GET_QUESTIONS = gql`
  query getQuestions($first: Int, $after: String, $filter: QuestionFilter) {
    questions(first: $first, after: $after, filter: $filter) {
      ...QuestionsConnection
    }
  }
  ${QuestionsConnectionFragment}
`

export const GET_QUESTION = gql`
  query getQuestion($id: ID!) {
    question(id: $id) {
      ...QuestionDetail
    }
  }
  ${QuestionDetailFragment}
`
