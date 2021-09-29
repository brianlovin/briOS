import * as React from 'react'
import { AddQuestionForm } from './AddQuestionForm'
import Dialog from '~/components/Dialog'

export function AddQuestionDialog({ children }) {
  return (
    <Dialog trigger={children} title={'Ask Me Anything'}>
      {({ closeModal }) => <AddQuestionForm closeModal={closeModal} />}
    </Dialog>
  )
}
