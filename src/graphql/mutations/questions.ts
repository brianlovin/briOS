import { gql } from '@apollo/client'

import { QuestionInfoFragment } from '~/graphql/fragments/question'

export const EDIT_QUESTION = gql`
  mutation editQuestion($id: ID!, $data: EditQuestionInput!) {
    editQuestion(id: $id, data: $data) {
      ...QuestionInfo
    }
  }
  ${QuestionInfoFragment}
`

export const DELETE_QUESTION = gql`
  mutation deleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`

export const ADD_QUESTION = gql`
  mutation addQuestion($data: AddQuestionInput!) {
    addQuestion(data: $data) {
      ...QuestionInfo
    }
  }
  ${QuestionInfoFragment}
`
