import * as React from 'react'
import { EditBookmarkForm } from './EditBookmarkForm'
import { DialogComponent } from '~/components/Dialog'

export function EditBookmarkDialog({ trigger, bookmark }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Add bookmark'}
      modalContent={({ closeModal }) => (
        <EditBookmarkForm bookmark={bookmark} closeModal={closeModal} />
      )}
    />
  )
}
