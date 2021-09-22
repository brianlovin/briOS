import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Plus } from 'react-feather'
import { Dialog, DialogTrigger, DialogContent } from '~/components/Dialog'
import AddBookmark from './AddBookmark'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export function BookmarksTitlebar({ scrollContainerRef }) {
  const { data, error } = useSWR('/api/isMe')

  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  function onClose(id) {
    router.push(`/bookmarks/${id}`)
    setIsOpen(false)
  }

  function trailingAccessory() {
    if (data?.isMe) {
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <div className="flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
              <Plus size={16} className="text-primary" />
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
  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title="Bookmarks"
      trailingAccessory={trailingAccessory()}
    />
  )
}
