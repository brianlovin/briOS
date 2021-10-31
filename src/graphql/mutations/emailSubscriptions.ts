import { gql } from '@apollo/client'

export const EDIT_EMAIL_SUBSCRIPTION = gql`
  mutation editEmailSubscription($data: EmailSubscriptionInput) {
    editEmailSubscription(data: $data) {
      emailSubscriptions {
        subscribed
        type
      }
    }
  }
`
