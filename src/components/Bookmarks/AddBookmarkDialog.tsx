import * as React from 'react'
import { AddBookmarkForm } from './AddBookmarkForm'
import { DialogComponent } from '~/components/Dialog'

export function AddBookmarkDialog({ trigger }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Add bookmark'}
      modalContent={({ closeModal }) => (
        <AddBookmarkForm closeModal={closeModal} />
      )}
    />
  )
}
