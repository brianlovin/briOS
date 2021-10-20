import * as React from 'react'
import { UserRole, useViewerQuery, Bookmark } from '~/graphql/types.generated'
import { EditBookmarkDialog } from '~/components/Bookmarks/EditBookmarkDialog'
import Button from '../Button'

export function BookmarkActions({ bookmark }) {
  const { data } = useViewerQuery()
  if (data?.viewer?.role === UserRole.Admin) {
    return (
      <EditBookmarkDialog bookmark={bookmark} trigger={<Button>Edit</Button>} />
    )
  }

  return null
}
