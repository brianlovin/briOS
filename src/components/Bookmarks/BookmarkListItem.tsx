import * as React from 'react'
import { Bookmark } from '~/graphql/types.generated'
import { Small, A } from '~/components/Typography'
import Linkify from '~/components/Linkify'
import EditingBookmarkListItem from './EditingBookmarkListItem'
import BookmarkReaction from './BookmarkReaction'
import Flex from '~/components/Flex'

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
    <Flex flexDirection="column" gap={bookmark.notes ? 8 : 4}>
      <A
        href={`${bookmark.url}?ref=brianlovin.com`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {bookmark.title || bookmark.url}
      </A>
      {bookmark.notes && (
        <Small
          style={{
            borderLeft: '2px solid var(--border-primary)',
            paddingLeft: '12px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <Linkify>{bookmark.notes}</Linkify>
        </Small>
      )}
      <Flex gap={12} alignItems="center">
        <BookmarkReaction bookmark={bookmark} />

        <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>

        <A
          href={`https://${bookmark.host}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Small>{bookmark.host || bookmark.url}</Small>
        </A>

        {editable && (
          <Flex gap={8} alignItems="center">
            <Small style={{ color: 'var(--text-placeholder)' }}>/</Small>

            <Small
              style={{ cursor: 'pointer' }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Small>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
})
