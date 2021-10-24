import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { EditStackForm } from './EditStackForm'

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
