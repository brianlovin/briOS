import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import React from 'react'

import { DELETE_USER } from '~/graphql/mutations/user'

export function DeleteUserDialog({ trigger }) {
  const router = useRouter()
  const [deleteUser] = useMutation(DELETE_USER)

  async function handleDelete() {
    await deleteUser()
    // TODO: Replace with your new authentication method
    router.push('/')
  }

  return (
    <div>
      {trigger}
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
          onClick={handleDelete}
        >
          Delete account
        </button>
      </div>
    </div>
  )
}
