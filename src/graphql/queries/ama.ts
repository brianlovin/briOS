import { AMAInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const GET_AMA_QUESTIONS = gql`
  query GetAMAQuestions {
    amaQuestions {
      ...AMAInfo
    }
  }
  ${AMAInfoFragment}
`
