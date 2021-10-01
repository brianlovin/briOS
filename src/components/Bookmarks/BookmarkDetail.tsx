import * as React from 'react'
import { useRouter } from 'next/router'
import {
  CommentType,
  useGetBookmarkQuery,
  useGetCommentsQuery,
} from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Comments } from '~/components/Comments'
import { BookmarkActions } from './BookmarkActions'
import {
  Detail,
  DetailContainer,
  DetailContentContainer,
} from '../ListDetail/Detail'

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

  return (
    <Detail.Container ref={scrollContainerRef}>
      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/bookmarks'}
        magicTitle
        title={data.bookmark.title}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
        trailingAccessory={<BookmarkActions bookmark={data.bookmark} />}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>{data.bookmark.title}</Detail.Title>
          <span className="inline-block leading-snug text-tertiary">
            {data.bookmark.host}
          </span>
          {data.bookmark.description && (
            <p className="prose text-primary">{data.bookmark.description}</p>
          )}
        </Detail.Header>
      </Detail.ContentContainer>

      <Comments refId={data.bookmark.id} type={CommentType.Bookmark} />
    </Detail.Container>
  )
}
