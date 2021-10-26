import * as React from 'react'
import { Link } from 'react-feather'

import { ListItem } from '~/components/ListDetail/ListItem'
import { BookmarkInfoFragment } from '~/graphql/types.generated'

interface Props {
  bookmark: BookmarkInfoFragment
  active: boolean
}

export const BookmarksListItem = React.memo<Props>(({ bookmark, active }) => {
  function handleClick(e, bookmark) {
    if (e.metaKey) {
      e.preventDefault()
      e.stopPropagation()
      window.open(bookmark.url, '_blank').focus()
    }
  }

  return (
    <ListItem
      key={bookmark.id}
      title={bookmark.title}
      byline={
        <div className="flex items-center space-x-2">
          {bookmark.faviconUrl ? (
            <img src={bookmark.faviconUrl} className="w-4 h-4 rounded" />
          ) : (
            <span className="flex items-center justify-center w-4 h-4">
              <Link size={12} />
            </span>
          )}
          <span>{bookmark.host}</span>
        </div>
      }
      active={active}
      href="/bookmarks/[id]"
      as={`/bookmarks/${bookmark.id}`}
      onClick={(e) => handleClick(e, bookmark)}
    />
  )
})
