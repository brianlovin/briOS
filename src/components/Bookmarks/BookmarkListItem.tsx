import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import EditingBookmarkListItem from './EditingBookmarkListItem'
import BookmarkReaction from './BookmarkReaction'
import MarkdownRenderer from '../MarkdownRenderer'

interface Props {
  editable: boolean
  bookmark: Bookmark
}

export const BookmarkListItem = React.memo((props: Props) => {
  const { bookmark, editable } = props
  const [isEditing, setIsEditing] = React.useState(false)

  if (isEditing) {
    return (
      <EditingBookmarkListItem
        onDone={() => setIsEditing(false)}
        bookmark={bookmark}
      />
    )
  }

  let cleanedCategory
  switch (bookmark.category) {
    case 'portfolio':
      cleanedCategory = 'Portfolio'
      break
    case 'website':
      cleanedCategory = 'Personal site'
      break
    default:
      cleanedCategory = 'Reading'
  }

  return (
    <div className="space-y-1 ">
      <span>
        <a
          href={`${bookmark.url}`}
          className="font-medium text-primary highlight-link-hover"
        >
          {bookmark.title}
        </a>
      </span>
      {bookmark.notes && (
        <div className="text-tertiary">
          <MarkdownRenderer>{bookmark.notes}</MarkdownRenderer>
        </div>
      )}
      <span className="flex items-center space-x-2">
        <BookmarkReaction bookmark={bookmark} />
        <span className="text-quaternary">{' · '}</span>
        <span className="text-tertiary">{cleanedCategory}</span>
        {editable && (
          <>
            <span className="text-quaternary">{' · '}</span>
            <button
              className="text-secondary highlight-link-hover"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </span>
    </div>
  )
})
