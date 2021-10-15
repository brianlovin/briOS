import { useRouter } from 'next/router'
import * as React from 'react'
import Dialog from '~/components/Dialog'
import { useDeleteUserMutation } from '~/graphql/types.generated'
import { DeleteButton } from '../Button'

export function DeleteUserDialog({ trigger }) {
  const router = useRouter()
  const [handleDelete] = useDeleteUserMutation()

  function onClick() {
    handleDelete()
    router.push('/api/auth/logout')
  }

  return (
    <Dialog
      trigger={trigger}
      title={'Delete account'}
      modalContent={({ closeModal }) => (
        <div className="flex flex-col space-y-4 text-left text-primary">
          <p>All comments, reactions, and AMA questions will be deleted.</p>

          <DeleteButton onClick={onClick}>Delete my account</DeleteButton>
        </div>
      )}
    />
  )
}
