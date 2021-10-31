import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { EditQuestionForm } from './EditQuestionForm'

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
