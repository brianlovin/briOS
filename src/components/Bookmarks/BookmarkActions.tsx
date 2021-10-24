import * as React from 'react'

import { EditBookmarkDialog } from '~/components/Bookmarks/EditBookmarkDialog'
import Button from '~/components/Button'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'

export function BookmarkActions({ bookmark }) {
  const { data } = useViewerQuery()
  if (data?.viewer?.role === UserRole.Admin) {
    return (
      <EditBookmarkDialog bookmark={bookmark} trigger={<Button>Edit</Button>} />
    )
  }

  return null
}
