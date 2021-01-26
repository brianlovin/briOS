import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import EditingBookmarkListItem from './EditingBookmarkListItem'
import BookmarkReaction from './BookmarkReaction'
import { BookOpen, Compass, Heart, Star } from 'react-feather'
import { Notes } from '../Timeline/Entry'
import Linkify from '../Linkify'

interface Props {
  editable: boolean
  bookmark: Bookmark
  divider?: boolean
}

function getTint(color: string) {
  switch (color) {
    case 'red':
      return 'text-red-800 dark:text-red-200 bg-red-500 bg-opacity-20'
    case 'blue':
      return 'text-blue-800 dark:text-blue-200 bg-blue-500 bg-opacity-20'
    case 'green':
      return 'text-green-800 dark:text-green-200 bg-green-500 bg-opacity-20'
    case 'purple':
      return 'text-purple-800 dark:text-purple-200 bg-purple-500 bg-opacity-20'
    case 'indigo':
      return 'text-indigo-800 dark:text-indigo-200 bg-indigo-500 bg-opacity-20'
    case 'pink':
      return 'text-pink-800 dark:text-pink-200 bg-pink-500 bg-opacity-20'
    case 'yellow':
      return 'text-yellow-800 dark:text-yellow-200 bg-yellow-500 bg-opacity-20'
    case 'gray':
    default:
      return 'text-primary bg-gray-200 dark:bg-gray-800'
  }
}

export const BookmarkListItem = React.memo((props: Props) => {
  const { bookmark, editable, divider = true } = props
  const [isEditing, setIsEditing] = React.useState(false)

  if (isEditing) {
    return (
      <EditingBookmarkListItem
        onDone={() => setIsEditing(false)}
        bookmark={bookmark}
      />
    )
  }

  let tint
  let cleanedCategory
  let Icon = Heart
  switch (bookmark.category) {
    case 'portfolio':
      tint = 'yellow'
      cleanedCategory = 'Portfolio'
      Icon = Star
      break
    case 'website':
      tint = 'blue'
      cleanedCategory = 'Personal site'
      Icon = Compass
      break
    default:
      tint = 'gray'
      Icon = BookOpen
      cleanedCategory = 'Reading'
  }

  return (
    <div className="flex mb-6 md:mb-6 timeline-item">
      {/* Icon and dividing line */}
      <div className="flex flex-col items-center">
        <div
          className={`flex justify-center p-3.5 rounded-full align-center border-4 border-gray-50 dark:border-gray-1000 ${getTint(
            tint
          )}`}
        >
          <Icon size={16} />
        </div>
        {divider && (
          <div className="flex-1 w-px -mb-6 bg-gray-200 md:-mb-6 dark:bg-gray-800 timeline-stroke" />
        )}
      </div>

      <div className="flex flex-col flex-1 ml-4 space-y-4">
        <div className="flex flex-col pt-1 contents-center">
          <span className="flex items-center space-x-2">
            <a
              href={`${bookmark.url}?ref=paulowe.com`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-blue-600 dark:text-blue-500">
                {bookmark.title}
              </span>
            </a>
          </span>
          <span className="flex items-center space-x-2">
            <BookmarkReaction bookmark={bookmark} />
            <span className="text-gray-300 dark:text-gray-700">{' / '}</span>
            <span className="text-sm text-tertiary">{cleanedCategory}</span>
            {editable && (
              <>
                <span className="text-gray-300 dark:text-gray-700">
                  {' / '}
                </span>
                <button
                  className="text-sm black-link"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </>
            )}
          </span>
        </div>
        {bookmark.notes && bookmark.notes.length > 0 && (
          <div className="flex flex-col space-y-4 timeline-full-width">
            <Notes>
              <p>
                <Linkify>{bookmark.notes}</Linkify>
              </p>
            </Notes>
          </div>
        )}
      </div>
    </div>
  )
})
