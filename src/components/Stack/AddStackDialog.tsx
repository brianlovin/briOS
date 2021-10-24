import * as React from 'react'
import { AddStackForm } from './AddStackForm'
import { DialogComponent } from '~/components/Dialog'

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
