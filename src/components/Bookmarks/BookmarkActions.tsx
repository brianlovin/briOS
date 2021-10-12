import * as React from 'react'
import { UserRole, useViewerQuery, Bookmark } from '~/graphql/types.generated'
import { EditBookmarkDialog } from '~/components/Bookmarks/EditBookmarkDialog'
import Button from '../Button'

interface Props {
  bookmark: Bookmark
}

export function BookmarkActions({ bookmark }: Props) {
  const { data } = useViewerQuery()
  if (data?.viewer?.role === UserRole.Admin) {
    return (
      <div>
        <EditBookmarkDialog bookmark={bookmark}>
          <Button>Edit</Button>
        </EditBookmarkDialog>
      </div>
    )
  }

  return null
}
