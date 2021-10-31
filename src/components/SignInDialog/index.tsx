import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { SignInDialogContent } from './SignInDialogContent'

export function SignInDialog({ children = null, trigger = null }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Sign In'}
      modalContent={() => <SignInDialogContent />}
    >
      {children ? ({ openModal }) => children({ openModal }) : null}
    </DialogComponent>
  )
}
