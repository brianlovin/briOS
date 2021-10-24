import * as React from 'react'
import Dialog from '~/components/Dialog'
import { SignInDialogContent } from './SignInDialogContent'

export function SignInDialog({ children = null, trigger = null }) {
  return (
    <Dialog
      trigger={trigger}
      title={'Sign In'}
      modalContent={() => <SignInDialogContent />}
    >
      {children ? ({ openModal }) => children({ openModal }) : null}
    </Dialog>
  )
}
