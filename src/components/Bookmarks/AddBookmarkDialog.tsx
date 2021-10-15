import * as React from 'react'
import { AddBookmarkForm } from './AddBookmarkForm'
import Dialog from '~/components/Dialog'

export function AddBookmarkDialog({ trigger }) {
  return (
    <Dialog
      trigger={trigger}
      title={'Add bookmark'}
      modalContent={({ closeModal }) => (
        <AddBookmarkForm closeModal={closeModal} />
      )}
    />
  )
}
