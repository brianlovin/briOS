import React from 'react'
import { DeleteButton } from '../Button'
import { Detail } from '../ListDetail/Detail'
import { DeleteUserDialog } from './DeleteUserDialog'

export function UserSettings() {
  return (
    <Detail.Container>
      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title>Settings</Detail.Title>
        </Detail.Header>
        <div className="flex space-x-4">
          <DeleteButton href="/api/auth/logout">Log out</DeleteButton>
          <DeleteUserDialog>
            <DeleteButton>Delete account</DeleteButton>
          </DeleteUserDialog>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
