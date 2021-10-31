import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { EditBookmarkForm } from './EditBookmarkForm'

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
