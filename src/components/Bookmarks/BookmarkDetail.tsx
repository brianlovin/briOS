import * as React from 'react'
import { useRouter } from 'next/router'
import { CommentType, useGetBookmarkQuery } from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Comments } from '~/components/Comments'
import { BookmarkActions } from './BookmarkActions'
import { Detail } from '../ListDetail/Detail'
import Button from '../Button'

export function BookmarkDetail({ id }) {
  const scrollContainerRef: React.RefObject<HTMLDivElement> = React.useRef(null)
  const titleRef: React.RefObject<HTMLHeadingElement> = React.useRef(null)
  const router = useRouter()
  const { data, loading, error } = useGetBookmarkQuery({
    variables: { id },
  })

  React.useEffect(() => {
    if (!loading && !data?.bookmark) router.push('/bookmarks')
  }, [loading])

  if (error || loading) {
    return null
  }

  if (!data || !data.bookmark) {
    return null
  }

  const { bookmark } = data

  return (
    <Detail.Container ref={scrollContainerRef}>
      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/bookmarks'}
        magicTitle
        title={bookmark.title}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
        trailingAccessory={<BookmarkActions bookmark={bookmark} />}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>{bookmark.title}</Detail.Title>
          <span className="inline-block leading-snug text-tertiary">
            {bookmark.host}
          </span>
          {bookmark.description && (
            <p className="prose text-primary">{bookmark.description}</p>
          )}
        </Detail.Header>
        <div className="mt-6">
          <Button href={bookmark.url}>Visit bookmark</Button>
        </div>
      </Detail.ContentContainer>

      <Comments refId={bookmark.id} type={CommentType.Bookmark} />
    </Detail.Container>
  )
}
