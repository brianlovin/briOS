import React from 'react'
import { DeleteButton } from '../Button'
import { DeleteUserDialog } from './DeleteUserDialog'

export function UserSettings() {
  return (
    <div className="w-full max-h-screen overflow-y-auto">
      <div className="justify-center py-24">
        <div className="max-w-screen-md px-4 mx-auto space-y-16">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold md:text-3xl text-primary">
              Settings
            </h1>
          </div>
          <DeleteButton href="/api/auth/logout">Log out</DeleteButton>
          <DeleteUserDialog>
            <DeleteButton>Delete account</DeleteButton>
          </DeleteUserDialog>
        </div>
      </div>
    </div>
  )
}
