import { gql } from '@apollo/client'

export const IS_ME = gql`
  query IsMe {
    isMe
  }
`
