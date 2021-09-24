import { AMAInfoFragment } from '../fragments'
import { gql } from '@apollo/client'

export const GET_AMA_QUESTIONS = gql`
  query GetAMAQuestions($skip: Int, $status: AMAStatus) {
    amaQuestions(skip: $skip, status: $status) {
      ...AMAInfo
    }
  }
  ${AMAInfoFragment}
`

export const GET_AMA_QUESTION = gql`
  query GetAMAQuestion($id: ID!) {
    amaQuestion(id: $id) {
      ...AMAInfo
    }
  }
  ${AMAInfoFragment}
`

export const GET_SIGNED_UPLOAD_URL = gql`
  query signedUploadUrl($id: ID!) {
    signedUploadUrl(id: $id)
  }
`

export const GET_SIGNED_PLAYBACK_URL = gql`
  query signedPlaybackUrl($id: ID!) {
    signedPlaybackUrl(id: $id)
  }
`

export const GET_TRANSCRIPTION = gql`
  query transcription($transcriptionId: ID!) {
    transcription(transcriptionId: $transcriptionId)
  }
`
