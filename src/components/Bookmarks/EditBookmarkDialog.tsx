import * as React from 'react'
import { EditBookmarkForm } from './EditBookmarkForm'
import Dialog from '~/components/Dialog'

export function EditBookmarkDialog({ children, bookmark }) {
  return (
    <Dialog trigger={children} title={'Add bookmark'}>
      {({ closeModal }) => (
        <EditBookmarkForm bookmark={bookmark} closeModal={closeModal} />
      )}
    </Dialog>
  )
}
