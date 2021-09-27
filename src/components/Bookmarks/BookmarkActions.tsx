import { useRouter } from 'next/router'
import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import { Dialog, DialogTrigger, DialogContent } from '../Dialog'
import { EditBookmark } from './EditBookmark'

interface Props {
  bookmark: Bookmark
}

export function BookmarkActions({ bookmark }: Props) {
  const { isMe } = useAuth()
  const router = useRouter()

  const [isOpen, setIsOpen] = React.useState(false)

  function onDone(id) {
    setIsOpen(false)
    if (!id) return router.push('/bookmarks')
  }

  if (isMe) {
    return (
      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <div className="flex items-center justify-center p-2 px-4 text-sm font-medium rounded-md cursor-pointer text-primary hover:bg-gray-200 dark:hover:bg-gray-800">
              Edit
            </div>
          </DialogTrigger>
          <DialogContent
            onPointerDownOutside={setIsOpen}
            onEscapeKeyDown={setIsOpen}
            title="New bookmark"
          >
            <div className="p-4">
              <EditBookmark bookmark={bookmark} onDone={onDone} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return null
}
