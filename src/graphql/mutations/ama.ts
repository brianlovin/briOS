import { gql } from '@apollo/client'
import { AMAInfoFragment } from '~/graphql/fragments/ama'

export const EDIT_AMA_QUESTION = gql`
  mutation editAMAQuestion(
    $id: ID!
    $question: String!
    $answer: String!
    $status: AMAStatus!
    $audioWaveform: [Float]
  ) {
    editAMAQuestion(
      id: $id
      question: $question
      answer: $answer
      status: $status
      audioWaveform: $audioWaveform
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
  mutation addAMAQuestion($text: String!) {
    addAMAQuestion(text: $text)
  }
  ${AMAInfoFragment}
`

export const ADD_AMA_AUDIO_PLAY = gql`
  mutation addAMAAudioPlay($id: ID!) {
    addAMAAudioPlay(id: $id)
  }
`

export const TRANSCRIBE_AUDIO = gql`
  mutation transcribeAudio($url: String!) {
    transcribeAudio(url: $url)
  }
`
