import * as React from 'react'
import { UserRole, useViewerQuery, Bookmark } from '~/graphql/types.generated'
import { EditBookmarkDialog } from '~/components/Bookmarks/EditBookmarkDialog'

interface Props {
  bookmark: Bookmark
}

export function BookmarkActions({ bookmark }: Props) {
  const { data } = useViewerQuery()
  if (data?.viewer?.role === UserRole.Admin) {
    return (
      <div>
        <EditBookmarkDialog bookmark={bookmark}>
          <div className="flex items-center justify-center p-2 px-4 text-sm font-semibold rounded-md cursor-pointer text-primary hover:bg-gray-200 dark:hover:bg-gray-800">
            Edit
          </div>
        </EditBookmarkDialog>
      </div>
    )
  }

  return null
}
