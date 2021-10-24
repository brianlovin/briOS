import * as React from 'react'
import { AddQuestionForm } from './AddQuestionForm'
import { DialogComponent } from '~/components/Dialog'

export function AddQuestionDialog({ trigger }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Ask Me Anything'}
      modalContent={({ closeModal }) => (
        <AddQuestionForm closeModal={closeModal} />
      )}
    />
  )
}
