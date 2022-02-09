import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'
import * as React from 'react'

import { DeleteButton } from '~/components/Button'
import { DialogComponent } from '~/components/Dialog'
import { useDeleteUserMutation } from '~/graphql/types.generated'
import { authik } from '~/lib/authik/client'

import { LoadingSpinner } from '../LoadingSpinner'

export function DeleteUserDialog({ trigger }) {
  const router = useRouter()
  const apolloClient = useApolloClient()
  const [handleDelete, { loading }] = useDeleteUserMutation()

  return (
    <DialogComponent
      trigger={trigger}
      title={'Delete account'}
      modalContent={({ closeModal }) => (
        <div className="text-primary flex flex-col space-y-4 p-4 text-left">
          <p>All comments, reactions, and AMA questions will be deleted.</p>

          <DeleteButton
            onClick={async () => {
              await handleDelete()
              await authik.clearSessionData()
              await apolloClient.resetStore()
            }}
          >
            {loading ? <LoadingSpinner /> : 'Delete my account'}
          </DeleteButton>
        </div>
      )}
    />
  )
}
