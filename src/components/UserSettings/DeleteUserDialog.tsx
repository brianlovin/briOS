import { useRouter } from 'next/router'
import * as React from 'react'

import { DeleteButton } from '~/components/Button'
import { DialogComponent } from '~/components/Dialog'
import { useDeleteUserMutation } from '~/graphql/types.generated'

export function DeleteUserDialog({ trigger }) {
  const router = useRouter()
  const [handleDelete] = useDeleteUserMutation()

  function onClick() {
    handleDelete()
    router.push('/api/auth/logout')
  }

  return (
    <DialogComponent
      trigger={trigger}
      title={'Delete account'}
      modalContent={() => (
        <div className="text-primary flex flex-col space-y-4 p-4 text-left">
          <p>All comments, reactions, and AMA questions will be deleted.</p>

          <DeleteButton onClick={onClick}>Delete my account</DeleteButton>
        </div>
      )}
    />
  )
}
