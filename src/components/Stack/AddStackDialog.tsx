import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { AddStackForm } from './AddStackForm'

export function AddStackDialog({ trigger }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'New stack'}
      modalContent={({ closeModal }) => (
        <AddStackForm closeModal={closeModal} />
      )}
    />
  )
}
