import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { AddBookmarkForm } from './AddBookmarkForm'

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
