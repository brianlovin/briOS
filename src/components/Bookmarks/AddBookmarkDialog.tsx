import * as React from 'react'
import { AddBookmarkForm } from './AddBookmarkForm'
import Dialog from '~/components/Dialog'

export function AddBookmarkDialog({ children }) {
  return (
    <Dialog trigger={children} title={'Add bookmark'}>
      {({ closeModal }) => <AddBookmarkForm closeModal={closeModal} />}
    </Dialog>
  )
}
