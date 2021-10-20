import * as React from 'react'
import { AddStackForm } from './AddStackForm'
import Dialog from '~/components/Dialog'

export function AddStackDialog({ trigger }) {
  return (
    <Dialog
      trigger={trigger}
      title={'New stack'}
      modalContent={({ closeModal }) => (
        <AddStackForm closeModal={closeModal} />
      )}
    />
  )
}
