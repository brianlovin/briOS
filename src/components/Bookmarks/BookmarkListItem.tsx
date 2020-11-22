import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import Linkify from '~/components/Linkify'
import EditingBookmarkListItem from './EditingBookmarkListItem'
import BookmarkReaction from './BookmarkReaction'

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

  return (
    <div
      className={`flex flex-col ${bookmark.notes ? 'space-y-2' : 'space-y-1'}`}
    >
      <a
        href={`${bookmark.url}?ref=brianlovin.com`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {bookmark.title || bookmark.url}
      </a>
      {bookmark.notes && (
        <p className="p-small pl-3 whitespace-pre-wrap border-l-2 border-gray-300 dark:border-gray-700">
          <Linkify>{bookmark.notes}</Linkify>
        </p>
      )}
      <div className="flex space-x-3 items-center">
        <BookmarkReaction bookmark={bookmark} />

        <p className="divider-gray">/</p>

        <a
          href={`https://${bookmark.host}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="p-small font-normal black-link">
            {bookmark.host || bookmark.url}
          </p>
        </a>

        {editable && (
          <div className="flex space-x-2 items-center">
            <p className="divider-gray">/</p>

            <button
              className="p-small black-link"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
