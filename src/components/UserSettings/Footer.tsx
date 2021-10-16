import React from 'react'
import Button, { DeleteButton } from '../Button'
import { DeleteUserDialog } from './DeleteUserDialog'

export function UserSettingsFooter() {
  return (
    <div className="flex justify-between pt-8 space-x-4 border-t border-gray-200 dark:border-gray-800">
      <Button href="/api/auth/logout">Log out</Button>
      <DeleteUserDialog trigger={<DeleteButton>Delete account</DeleteButton>} />
    </div>
  )
}
