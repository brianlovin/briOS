import React from 'react'
import { useViewerQuery } from '~/graphql/types.generated'
import { DeleteButton } from '../Button'
import { Detail } from '../ListDetail/Detail'
import { SignInDialog } from '../SignIn'
import { SignInDialogContent } from '../SignIn/SignInDialogContent'
import { DeleteUserDialog } from './DeleteUserDialog'

export function UserSettings() {
  const { data } = useViewerQuery()
  return (
    <Detail.Container>
      <Detail.ContentContainer>
        {data?.viewer ? (
          <>
            <Detail.Header>
              <Detail.Title>Settings</Detail.Title>
            </Detail.Header>
            <div className="flex space-x-4">
              <DeleteButton href="/api/auth/logout">Log out</DeleteButton>
              <DeleteUserDialog
                trigger={<DeleteButton>Delete account</DeleteButton>}
              />
            </div>
          </>
        ) : (
          <>
            <Detail.Header>
              <Detail.Title>Sign in</Detail.Title>
            </Detail.Header>
            <div className="mt-12 -mx-4 md:-mx-6">
              <SignInDialogContent />
            </div>
          </>
        )}
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
