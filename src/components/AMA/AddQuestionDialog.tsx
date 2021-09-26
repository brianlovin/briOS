import * as React from 'react'
import { Dialog, DialogTrigger, DialogContent } from '~/components/Dialog'
import { AddQuestionForm } from './AddQuestionForm'

export function AddQuestionDialog({ children }) {
  const [isOpen, setIsOpen] = React.useState(false)

  function onClose() {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={setIsOpen}
        onEscapeKeyDown={setIsOpen}
        title="Ask me anything"
      >
        <div className="p-4">
          <AddQuestionForm onCloseDialog={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
