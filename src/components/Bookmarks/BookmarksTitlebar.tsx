import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Plus } from 'react-feather'
import { useIsMeQuery } from '~/graphql/types.generated'
import { AddBookmarkDialog } from './AddBookmarkDialog'

export function BookmarksTitlebar({ scrollContainerRef }) {
  const { data } = useIsMeQuery()

  function trailingAccessory() {
    if (data?.isMe) {
      return (
        <AddBookmarkDialog>
          <div className="flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
            <Plus size={16} className="text-primary" />
          </div>
        </AddBookmarkDialog>
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
