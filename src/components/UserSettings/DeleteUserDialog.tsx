import { useRouter } from 'next/router'
import * as React from 'react'
import Dialog from '~/components/Dialog'
import { useDeleteUserMutation } from '~/graphql/types.generated'
import { DeleteButton } from '../Button'

export function DeleteUserDialog({ children }) {
  const router = useRouter()
  const [handleDelete, { data, loading, error }] = useDeleteUserMutation()

  function onClick() {
    handleDelete()
    router.push('/api/auth/logout')
  }

  return (
    <Dialog trigger={children} title={'Delete account'}>
      {({ closeModal }) => (
        <div className="flex flex-col space-y-4 text-left text-primary">
          <p>All comments, reactions, and AMA questions will be deleted.</p>

          <DeleteButton onClick={onClick}>Delete my account</DeleteButton>
        </div>
      )}
    </Dialog>
  )
}
