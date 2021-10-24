import * as React from 'react'
import { EditQuestionForm } from './EditQuestionForm'
import { DialogComponent } from '~/components/Dialog'

export function EditQuestionDialog({ trigger, question }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Edit question'}
      modalContent={({ closeModal }) => (
        <EditQuestionForm question={question} closeModal={closeModal} />
      )}
    />
  )
}
