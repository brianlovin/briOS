import * as React from 'react'
import { EditStackForm } from './EditStackForm'
import Dialog from '~/components/Dialog'

export function EditStackDialog({ trigger, stack }) {
  return (
    <Dialog
      trigger={trigger}
      title={'Add bookmark'}
      modalContent={({ closeModal }) => (
        <EditStackForm stack={stack} closeModal={closeModal} />
      )}
    />
  )
}
