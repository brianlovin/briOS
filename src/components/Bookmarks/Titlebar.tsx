import * as React from 'react'
import { useAuth } from '~/hooks/useAuth'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Plus } from 'react-feather'
import { Dialog, DialogTrigger, DialogContent } from '~/components/Dialog'
import AddBookmark from './AddBookmark'
import { useRouter } from 'next/router'

export function BookmarksTitlebar() {
  const { isMe } = useAuth()

  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  function onClose(id) {
    console.log('ON CLOSE', id)
    router.push(`/bookmarks/${id}`)
    setIsOpen(false)
  }

  function trailingAccessory() {
    if (isMe) {
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <div className="flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
              <Plus size={16} />
            </div>
          </DialogTrigger>
          <DialogContent
            onPointerDownOutside={setIsOpen}
            onEscapeKeyDown={setIsOpen}
            title="New bookmark"
          >
            <div className="p-4">
              <AddBookmark onCloseDialog={onClose} />
            </div>
          </DialogContent>
        </Dialog>
      )
    }
    return null
  }
  return <TitleBar title="Bookmarks" trailingAccessory={trailingAccessory()} />
}
