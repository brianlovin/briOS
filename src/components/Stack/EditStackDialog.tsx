import * as React from 'react'
import { EditStackForm } from './EditStackForm'
import { DialogComponent } from '~/components/Dialog'

export function EditStackDialog({ trigger, stack }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Edit stack'}
      modalContent={({ closeModal }) => (
        <EditStackForm stack={stack} closeModal={closeModal} />
      )}
    />
  )
}
