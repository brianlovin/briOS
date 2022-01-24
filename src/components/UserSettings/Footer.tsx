import * as React from 'react'

import Button, { DeleteButton } from '~/components/Button'

import { DeleteUserDialog } from './DeleteUserDialog'

export function UserSettingsFooter() {
  return (
    <div className="flex justify-between space-x-4 py-12">
      <a href="/api/auth/logout">
        <Button>Log out</Button>
      </a>
      <DeleteUserDialog trigger={<DeleteButton>Delete account</DeleteButton>} />
    </div>
  )
}
