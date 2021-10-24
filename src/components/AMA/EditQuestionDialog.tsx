import * as React from 'react'
import { EditQuestionForm } from './EditQuestionForm'
import Dialog from '~/components/Dialog'

export function EditQuestionDialog({ trigger, question }) {
  return (
    <Dialog
      trigger={trigger}
      title={'Edit question'}
      modalContent={({ closeModal }) => (
        <EditQuestionForm question={question} closeModal={closeModal} />
      )}
    />
  )
}
