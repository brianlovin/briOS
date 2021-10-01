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
        <DeleteButton href="/api/auth/logout">Log out</DeleteButton>
        <DeleteUserDialog>
          <DeleteButton>Delete account</DeleteButton>
        </DeleteUserDialog>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
