import * as React from 'react'
import Dialog from '~/components/Dialog'
import { SignInDialogContent } from './SignInDialogContent'

export function SignInDialog({ children }) {
  return (
    <Dialog
      trigger={null}
      title={'Sign In'}
      modalContent={() => <SignInDialogContent />}
    >
      {({ openModal }) => children({ openModal })}
    </Dialog>
  )
}
