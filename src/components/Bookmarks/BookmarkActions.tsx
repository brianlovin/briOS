import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import { useAuth } from '~/hooks/useAuth'
import { EditBookmarkDialog } from '~/components/Bookmarks/EditBookmarkDialog'
import { Plus } from 'react-feather'

interface Props {
  bookmark: Bookmark
}

export function BookmarkActions({ bookmark }: Props) {
  const { isMe } = useAuth()

  if (isMe) {
    return (
      <div>
        <EditBookmarkDialog bookmark={bookmark}>
          <div className="flex items-center justify-center p-2 px-4 text-sm font-semibold rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
            Edit
          </div>
        </EditBookmarkDialog>
      </div>
    )
  }

  return null
}
