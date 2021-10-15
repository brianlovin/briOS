import * as React from 'react'
import { AddQuestionForm } from './AddQuestionForm'
import Dialog from '~/components/Dialog'

export function AddQuestionDialog({ trigger }) {
  return (
    <Dialog
      trigger={trigger}
      title={'Ask Me Anything'}
      modalContent={({ closeModal }) => (
        <AddQuestionForm closeModal={closeModal} />
      )}
    />
  )
}
