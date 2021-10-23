import * as React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CommentType, useGetBookmarkQuery } from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Comments } from '~/components/Comments'
import { BookmarkActions } from './BookmarkActions'
import { Detail } from '../ListDetail/Detail'
import { PrimaryButton } from '../Button'
import { Link as LinkIcon } from 'react-feather'
import { Tags } from '../Tag'

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
          <Tags tags={bookmark.tags} />
          <Link href={bookmark.url}>
            <a className="block">
              <Detail.Title ref={titleRef}>{bookmark.title}</Detail.Title>
            </a>
          </Link>
          <Link href={bookmark.url}>
            <a className="inline-block leading-snug text-tertiary">
              {bookmark.host}
            </a>
          </Link>
          {bookmark.description && (
            <p className="prose text-primary">{bookmark.description}</p>
          )}
        </Detail.Header>
        <div className="mt-6">
          <PrimaryButton size="large" href={bookmark.url}>
            <LinkIcon size={14} />
            <span>Visit</span>
          </PrimaryButton>
        </div>
      </Detail.ContentContainer>

      <Comments refId={bookmark.id} type={CommentType.Bookmark} />
    </Detail.Container>
  )
}
