import * as React from 'react'
import { Dialog, DialogTrigger, DialogContent } from '~/components/Dialog'
import { useRouter } from 'next/router'
import { AddBookmarkForm } from './AddBookmarkForm'

export function AddBookmarkDialog({ children }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  function onClose(id) {
    router.push(`/bookmarks/${id}`)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={setIsOpen}
        onEscapeKeyDown={setIsOpen}
        title="New bookmark"
      >
        <div className="p-4">
          <AddBookmarkForm onCloseDialog={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
